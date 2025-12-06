import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';

const ARCHITECT_PROMPT = `You are an expert at explaining complex technical systems in plain, visual-friendly language. Given a description of a system, create a plain-English summary suitable for visual illustration.

Focus on:
- What users/customers can DO with the system
- The main flows and interactions between ALL parties
- Key capabilities from a business perspective
- The TOOLS and INTERFACES people actually use (not just the backend systems)

IMPORTANT for healthcare/HL7/FHIR systems:
- Providers interact through their EHR systems (Epic, Cerner, etc.) - show the EHR as the provider's interface
- Payers have their own systems that connect via APIs
- Patients may have portals or apps
- Always show the human-facing tools, not just the data exchange

DO NOT mention specific AWS services or technical infrastructure.
DO NOT use jargon like "Lambda", "S3", "DynamoDB", "API Gateway", etc.

Output your response in this exact format:
TITLE: [A short, punchy title for the diagram, 3-6 words]
PROBLEM: [One sentence describing the problem this system solves]
DESCRIPTION: [4-6 sentences describing what the system does from a user's perspective, including the tools/interfaces each party uses]`;

const STYLE_PROMPTS: Record<string, string> = {
  xplane: `Visual thinking illustration with confident hand-drawn energy:
DRAWING: Bold sketchy linework with confident variable strokes, thicker lines for emphasis, black/charcoal lines with occasional colored outlines for key elements
COLOR: Vibrant saturated palette - primary blue (#1E88E5), energetic orange (#FF7043), fresh green (#43A047), warm coral (#FF5252) as accent. White background with subtle warm cream (#FFFBF5) tint in content areas
FIGURES: Expressive rounded characters with personality - simple but not stick figures, more like friendly mascots. Show emotion and action through posture
DEPTH: Create visual layers - larger elements in foreground, smaller in background. Subtle drop shadows (soft, warm gray) on key elements to lift them off the page
COMPOSITION: Dynamic information landscape with clear visual flow. Use size contrast dramatically - important elements 2-3x larger. Generous whitespace as breathing room
ICONS: Refined but simple iconography - recognizable symbols rather than pure geometric shapes. Consistent stroke weight within icon sets
CONNECTORS: Flowing curved arrows with momentum, dashed lines for data flow, solid for user actions. Arrow heads should feel hand-drawn but confident
TEXT: Bold hand-lettered titles with character, clean sans-serif labels for clarity. Mix hand-drawn headers with readable annotations
TONE: Professional yet approachable, confident, clear, energetic
LAYOUT: Must include a TITLE at top in bold hand-lettered style (large, confident, slightly tilted for energy), and below it a PROBLEM statement in smaller italic hand-written font explaining what problem this solves. The main illustration goes below these header elements.
AVOID: Stiff corporate clip-art, flat lifeless icons, cramped layouts, muted washed-out colors, perfectly straight mechanical lines, generic stock illustration feel`,

  tron: `Excalidraw whiteboard sketch style on dark slate background (#1A202C):
STYLE: Hand-drawn rough white sketch lines. Imperfect wobbly strokes like whiteboard markers. Variable line weight. Multiple overlapping strokes.
ACCENTS: Neon orange (#FF6B35) glow on key elements, subtle cyan (#00D9FF) glow on secondary elements
COLOR: White sketch lines dominant, bright neon accents sparingly
COMPOSITION: Information landscape with generous negative space, dark background for contrast
TEXT: White hand-drawn labels, technical annotations, sketch-style lettering
LAYOUT: Must include a TITLE at top in bold white lettering, and below it a PROBLEM statement in smaller gray text explaining what problem this solves. The main illustration goes below these header elements.
TONE: Technical, modern, digital aesthetic
AVOID: Polished vectors, bright backgrounds, photorealism`,
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { description, style = 'xplane' } = await request.json();

    if (!description || typeof description !== 'string') {
      return new Response('Missing description', { status: 400 });
    }

    const anthropicKey = import.meta.env.ANTHROPIC_API_KEY;
    const googleKey = import.meta.env.GOOGLE_API_KEY;

    if (!anthropicKey || !googleKey) {
      return new Response('API keys not configured', { status: 500 });
    }

    // Step 1: Use Claude to convert technical description to visual-friendly narrative
    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `${ARCHITECT_PROMPT}\n\nSystem to describe:\n${description}`,
        },
      ],
    });

    const textContent = claudeResponse.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return new Response('Failed to generate description', { status: 500 });
    }

    const visualDescription = textContent.text;
    console.log('Claude description:', visualDescription);

    // Step 2: Generate the illustration with Gemini
    const ai = new GoogleGenAI({ apiKey: googleKey });

    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.xplane;
    const fullPrompt = `${stylePrompt}

${visualDescription}

Create a visual illustration that explains this system clearly. The diagram MUST have:
1. A prominent TITLE at the top (from the TITLE line above)
2. A PROBLEM statement in smaller font below the title (from the PROBLEM line above)
3. The main visual explanation below

Include short hand-written labels and annotations where helpful to clarify key elements. The illustration should be immediately understandable and capture the core idea.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: '16:9',
          imageSize: '2K',
        },
      },
    });

    let imageData: string | undefined;
    let mimeType: string = 'image/png';

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          imageData = part.inlineData.data;
          mimeType = part.inlineData.mimeType || 'image/png';
          break;
        }
      }
    }

    if (!imageData) {
      console.log('No image data found in Gemini response');
      return new Response('Failed to generate image', { status: 500 });
    }

    // Return the image directly as binary with proper content type
    const buffer = Buffer.from(imageData, 'base64');

    return new Response(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'X-Description': encodeURIComponent(visualDescription),
      },
    });
  } catch (error) {
    console.error('Architect error:', error);
    return new Response(
      error instanceof Error ? error.message : 'Generation failed',
      { status: 500 }
    );
  }
};
