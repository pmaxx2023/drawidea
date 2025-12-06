import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';
import { validateApiKey, recordUsage } from '../../../lib/api-auth';

// Style aliases for user-friendly names
const STYLE_ALIASES: Record<string, string> = {
  whiteboard: 'xplane',
};

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

  'minimal-line': `Minimal single continuous line art illustration on pure white background:
STYLE: ONE unbroken black line that never lifts from the paper, Picasso one-line drawing style
DRAWING: Elegant, simple, artistic. The line flows naturally creating the shape
COLOR: No fills, no colors, just the single black line on white
COMPOSITION: Centered, clean, maximum negative space
TEXT: Minimal or no text, if needed use simple elegant lettering
LAYOUT: Must include a TITLE at top in elegant minimal lettering, and below it a PROBLEM statement in smaller lighter text explaining what problem this solves.
TONE: Elegant, artistic, sophisticated
AVOID: Multiple separate lines, shading, colors, complexity, filled shapes`,

  woodcut: `Woodcut linocut print illustration style:
STYLE: Bold black and white only, carved texture like block printing
DRAWING: Strong contrast, rough carved edges, visible cut marks
AESTHETIC: Editorial literary style like vintage book illustrations
COMPOSITION: Bold graphic shapes, high contrast areas
TEXT: Bold carved-style lettering if needed, vintage typography feel
LAYOUT: Must include a TITLE at top in bold carved-style lettering, and below it a PROBLEM statement in smaller text explaining what problem this solves.
TONE: Literary, editorial, classic, timeless
AVOID: Colors, smooth lines, gradients, digital look, soft edges`,

  risograph: `Risograph editorial illustration style:
STYLE: Visible grain texture like screen printing, slight color misregistration
COLOR: Muted pastel colors (dusty pink, sage green, cream, soft coral), limited 3-color palette
AESTHETIC: New Yorker magazine style, sophisticated, artistic
COMPOSITION: Flat shapes, overlapping colors creating texture, editorial feel
TEXT: Editorial-style typography, misregistered print effect on text
LAYOUT: Must include a TITLE at top in editorial-style typography, and below it a PROBLEM statement in smaller italic text explaining what problem this solves.
TONE: Sophisticated, artistic, editorial, refined
AVOID: Bright saturated colors, smooth digital look, photorealism, gradients`,

  editorial: `Magazine editorial conceptual illustration - abstract visual metaphor style:
PURPOSE: Create a single powerful visual that captures the ESSENCE and EMOTION of the topic, not a literal explanation.
STYLE: Bold, conceptual, metaphorical. Combine 2-3 symbolic elements into one striking composition.
APPROACH: Extract the core tension, emotion, or theme. Use visual metaphors.
COMPOSITION: Strong central focal point, dramatic scale contrasts, elements that create visual tension or harmony.
COLOR: Limited bold palette (2-4 colors max), high contrast.
FIGURES: Stylized human forms when needed - not realistic, more iconic/symbolic.
TEXT: Only a short TITLE at top in elegant editorial typography. NO explanatory text, NO labels.
TONE: Thought-provoking, sophisticated, emotionally resonant
AVOID: Literal depictions, flowcharts, step-by-step diagrams, multiple labeled elements`,

  roadmap: `Technical product architecture roadmap - a visual system diagram showing how to build something:
PURPOSE: Transform a product/project idea into a technical architecture visualization.
STRUCTURE: Break into logical TECHNICAL LAYERS arranged as connected system components.
VISUAL STYLE: Technical but approachable - like a whiteboard architecture session.
LAYOUT: Left-to-right or layered top-to-bottom flow showing data/requests movement.
ANNOTATIONS: Include brief technical notes like "REST API", "WebSocket", "OAuth2"
TITLE: Bold project name at top with "Architecture Overview" subtitle
COLOR: Use color to distinguish layers - blues for infrastructure, greens for backend, oranges for frontend
AVOID: Generic icons, cutesy illustrations, non-technical metaphors`,

  infographic: `Clean modern infographic with hub-and-spoke layout radiating from a central concept:
BACKGROUND: Soft gradient from light lavender to pale blue, clean and professional
LAYOUT: Central focal point with branches/connections radiating outward. Hub-and-spoke or mind-map structure.
CONNECTORS: Subtle circuit-board style lines connecting elements
ICONS: Colorful flat design icons with subtle drop shadows
COLOR PALETTE: Soft pastels with pops of vibrant color
TYPOGRAPHY: Clean sans-serif fonts. Bold headers, lighter descriptions.
STYLE: Polished, professional, friendly. Clean vector aesthetic.
AVOID: Harsh colors, sharp corners, cluttered layouts, hand-drawn aesthetics`,

  'fhir-technical': `FHIR healthcare data standard technical diagram - clean architectural style:
PURPOSE: Visualize FHIR resources, profiles, and data structures with medical precision.
STYLE: Clean technical diagram like software architecture docs. Professional, precise.
RESOURCES: Show as rounded rectangles with resource name as header. Elements listed inside with data types.
CARDINALITY: Always show cardinality notation (0..1, 1..1, 0..*, 1..*) next to elements.
COLOR CODING: Required elements in solid blue (#1E88E5), Optional in light gray (#9E9E9E), Extensions in orange (#FF7043), Must Support with green checkmark (#43A047).
REFERENCES: Arrows between resources showing Reference() relationships. Label arrows with element name.
SECTIONS: Group elements logically - identifiers, demographics, clinical, administrative.
TYPOGRAPHY: Clean sans-serif. Resource names bold. Element names in monospace font.
LAYOUT: Title at top with IG name if applicable. Main diagram below. Legend for color coding.
AVOID: Overly decorative elements, unclear cardinalities, missing data types, ambiguous references.`,

  'fhir-workflow': `FHIR healthcare data flow diagram - swimlane process style:
PURPOSE: Show how FHIR resources flow between actors in healthcare workflows.
STYLE: Swimlane diagram with clear actor separation. Timeline flows left-to-right.
ACTORS: Horizontal lanes for each actor (Patient, Provider, Lab, Payer, etc.). Label lanes clearly.
RESOURCES: Show as document icons or boxes with resource name. Color by type.
API CALLS: Arrows between lanes showing REST operations (POST, GET, PUT). Label with operation.
EVENTS: Vertical dotted lines for key events (order placed, specimen collected, results ready).
SUBSCRIPTIONS: Dashed arrows for subscription notifications.
TIMING: Optional time markers along bottom axis.
COLOR PALETTE: Blues for clinical (#1E88E5), Greens for administrative (#43A047), Orange for financial (#FF7043).
TYPOGRAPHY: Actor names in bold. Resource names in regular. API verbs in monospace.
TITLE: Workflow name at top (e.g., "Lab Order to Result Workflow").
AVOID: Crossing arrows when possible, unclear actor boundaries, missing API operations.`,

  'fhir-hierarchy': `FHIR profile inheritance and extension hierarchy diagram - tree structure style:
PURPOSE: Show how FHIR profiles inherit from base resources and add constraints/extensions.
STYLE: Top-down tree diagram showing inheritance relationships.
BASE: Root node shows base FHIR resource (e.g., Patient, Observation).
PROFILES: Child nodes show derived profiles. Connect with solid lines.
CONSTRAINTS: Show key constraints added at each level (cardinality changes, terminology bindings).
EXTENSIONS: Show extension additions in orange boxes attached to profile nodes.
INHERITANCE: Arrow direction shows "inherits from" relationship (child -> parent).
DEPTH: Support multiple inheritance levels (Base -> US Core -> State-specific).
ANNOTATIONS: Note which IG defines each profile.
COLOR CODING: Base resources in gray, US Core profiles in blue, IG-specific profiles in teal, Extensions in orange.
TYPOGRAPHY: Profile names in bold. Constraint summaries in smaller text.
TITLE: "Profile Hierarchy: [Resource Name]" at top.
AVOID: Cluttered constraint lists, unclear inheritance direction, missing extension definitions.`,
};

export const POST: APIRoute = async ({ request }) => {
  // Check for API key in header
  const authHeader = request.headers.get('Authorization');
  const apiKey = authHeader?.replace('Bearer ', '');

  if (!apiKey) {
    return new Response(JSON.stringify({
      error: 'Missing API key',
      message: 'Include your API key in the Authorization header: Bearer clario_xxx'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate API key
  const validation = await validateApiKey(apiKey);

  if (!validation.valid) {
    return new Response(JSON.stringify({
      error: 'Invalid API key',
      message: validation.error
    }), {
      status: validation.error?.includes('Rate limit') ? 429 : 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { concept, style: rawStyle = 'whiteboard' } = body;

    // Resolve style aliases
    const style = STYLE_ALIASES[rawStyle] || rawStyle;

    if (!concept || typeof concept !== 'string') {
      return new Response(JSON.stringify({
        error: 'Missing concept',
        message: 'Provide a "concept" field with the text to illustrate'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validStyles = [...Object.keys(STYLE_PROMPTS), ...Object.keys(STYLE_ALIASES)];
    if (!STYLE_PROMPTS[style]) {
      return new Response(JSON.stringify({
        error: 'Invalid style',
        message: `Valid styles: ${validStyles.join(', ')}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Record usage
    await recordUsage(apiKey, '/api/v1/generate', style);

    const googleApiKey = import.meta.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
      return new Response(JSON.stringify({
        error: 'Server configuration error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ai = new GoogleGenAI({ apiKey: googleApiKey });

    const stylePrompt = STYLE_PROMPTS[style];
    const fullPrompt = `${stylePrompt}

CONTENT TO ILLUSTRATE: ${concept}

Create a visual illustration that explains this concept clearly. The diagram MUST have:
1. A prominent TITLE at the top summarizing the concept (3-6 words)
2. A PROBLEM statement in smaller font below the title (one sentence explaining what problem this solves)
3. The main visual explanation below`;

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

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          imageData = part.inlineData.data;
          break;
        }
      }
    }

    if (!imageData) {
      return new Response(JSON.stringify({
        error: 'Generation failed',
        message: 'Failed to generate image'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      image: {
        data: imageData,
        mimeType: 'image/png',
        encoding: 'base64'
      },
      usage: {
        remaining: validation.keyData!.rateLimit - validation.keyData!.usageToday - 1,
        limit: validation.keyData!.rateLimit,
        resetsAt: validation.keyData!.usageResetAt
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API v1 generate error:', error);
    return new Response(JSON.stringify({
      error: 'Generation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Also support GET for API info
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    endpoint: '/api/v1/generate',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: {
      concept: 'string (required) - The concept to illustrate',
      style: 'string (optional) - One of: whiteboard, tron, minimal-line, woodcut, risograph, editorial, roadmap, infographic, fhir-technical, fhir-workflow, fhir-hierarchy. Default: whiteboard'
    },
    response: {
      success: 'boolean',
      image: {
        data: 'base64 encoded PNG',
        mimeType: 'image/png',
        encoding: 'base64'
      },
      usage: {
        remaining: 'number - requests remaining today',
        limit: 'number - daily limit',
        resetsAt: 'ISO timestamp'
      }
    },
    rateLimit: '100 requests/day (free tier)'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
