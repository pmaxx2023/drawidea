import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

const REVERSE_ARCHITECT_PROMPT = `You are an expert AWS solutions architect. Given a description of a system (originally derived from a visual explanation), design a complete AWS architecture.

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

1. **[Flow Name]**: [Step by step description]

### Security Considerations
- [Key security points]

### Cost Optimization Tips
- [Cost saving recommendations]

### Getting Started
\`\`\`bash
# Quick start commands or CloudFormation snippet
\`\`\`

Be specific about AWS services. Use current best practices (serverless-first, managed services preferred).`;

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

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `${REVERSE_ARCHITECT_PROMPT}\n\nSystem to architect:\n${description}`,
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
