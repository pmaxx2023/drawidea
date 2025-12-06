import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

const ANALYSIS_PROMPT = `You are an expert at analyzing technical architecture diagrams and explaining them in plain, human-friendly language.

Look at this architecture diagram and describe what the system DOES from a business/user perspective. Focus on:
- What the system enables users to do
- The main flows and interactions
- Key capabilities and features

DO NOT mention specific AWS services, technical infrastructure names, or implementation details.
DO NOT use jargon like "Lambda", "S3", "DynamoDB", "API Gateway", etc.

Instead, describe it as if explaining to a business executive who wants to understand WHAT the system does, not HOW it's built.

Output your response in this exact format:
TITLE: [A short, punchy title for the diagram, 3-6 words]
PROBLEM: [One sentence describing the problem this system solves]
DESCRIPTION: [3-5 sentences that captures the essence of what this architecture delivers]`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { image } = await request.json();

    if (!image || typeof image !== 'string') {
      return new Response('Missing image data', { status: 400 });
    }

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response('Anthropic API key not configured', { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    // Extract base64 data and media type from data URL
    const matches = image.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return new Response('Invalid image format', { status: 400 });
    }

    const mediaType = matches[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    const base64Data = matches[2];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return new Response('Failed to analyze image', { status: 500 });
    }

    return new Response(JSON.stringify({ description: textContent.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      error instanceof Error ? error.message : 'Analysis failed',
      { status: 500 }
    );
  }
};
