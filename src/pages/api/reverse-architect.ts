import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import {
  detectDomain,
  buildDomainContext,
  buildArchitectureValidationContext,
  AWS_PATTERNS,
  type AWSDomain,
} from '../../lib/aws-knowledge';

const REVERSE_ARCHITECT_PROMPT = `You are an expert AWS solutions architect. Given a description of a system (originally derived from a visual explanation), design a complete AWS architecture.

CRITICAL: You must follow the ARCHITECTURE VALIDATION RULES provided below. These are not suggestions - violating them creates architecturally incorrect diagrams that will be rejected.

Output the following sections:

## AWS Architecture: [System Name]

### Overview
[2-3 sentence summary]

### AWS Services

| Service | Purpose |
|---------|---------|
| [Service] | [Why it's used] |

### Architecture Diagram

\`\`\`mermaid
graph TD
    subgraph "Layer Name"
        A[Component] --> B[Component]
    end
\`\`\`

### Data Flows

1. **[Flow Name]**: [Step by step description showing COMPLETE paths from request to response/storage]

### Security Considerations
- [Key security points]

### Cost Optimization Tips
- [Cost saving recommendations]

### Getting Started
\`\`\`bash
# Quick start commands or CloudFormation snippet
\`\`\`

DESIGN PRINCIPLES:
1. PICK ONE COMPUTE LAYER per request type (Lambda OR ECS OR EC2, not multiple)
2. API Gateway is ALWAYS an entry point, never behind compute
3. Web servers go in PRIVATE subnets behind ALB, not public
4. Every write operation must show the complete path to persistent storage
5. Async services (SQS, SNS, EventBridge) must show both producer AND consumer
6. One CloudFront distribution per origin type (don't duplicate)
7. Managed services (CloudFront, Route53, API Gateway) are regional, not inside VPC

Be specific about AWS services. Use current best practices (serverless-first, managed services preferred).`;

/**
 * Get relevant architecture patterns for the detected domain
 */
function getPatternContext(domain: AWSDomain | null): string {
  if (!domain) return '';

  const patterns = AWS_PATTERNS[domain];
  if (!patterns || patterns.length === 0) return '';

  let context = `\n## RECOMMENDED PATTERNS FOR ${domain.toUpperCase()}:\n\n`;
  for (const pattern of patterns) {
    context += `**${pattern.name}**: ${pattern.description}\n`;
    context += `Flow: ${pattern.flow}\n`;
    context += `Use when: ${pattern.whenToUse.join(', ')}\n\n`;
  }
  return context;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== 'string') {
      return new Response('Missing description', { status: 400 });
    }

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response('API key not configured', { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    // Detect domain and build context
    const domain = detectDomain(description);
    const domainContext = domain ? buildDomainContext(domain) : '';
    const patternContext = getPatternContext(domain);
    const validationContext = buildArchitectureValidationContext();

    // Build the full prompt with all context
    const fullPrompt = [
      REVERSE_ARCHITECT_PROMPT,
      validationContext,
      patternContext,
      domainContext,
      `\nSystem to architect:\n${description}`,
    ].join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return new Response('Failed to generate architecture', { status: 500 });
    }

    return new Response(JSON.stringify({ architecture: textContent.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Reverse architect error:', error);
    return new Response(
      error instanceof Error ? error.message : 'Generation failed',
      { status: 500 }
    );
  }
};
