import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

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
PURPOSE: Create a single powerful visual that captures the ESSENCE and EMOTION of the topic, not a literal explanation. Think New Yorker, The Atlantic, Harvard Business Review cover art.
STYLE: Bold, conceptual, metaphorical. Combine 2-3 symbolic elements into one striking composition.
APPROACH: Extract the core tension, emotion, or theme. Use visual metaphors - if about financial worry, show a figure being crushed by giant coins or balancing on a teetering chart. If about burnout, show a candle person melting. If about AI, show human and machine elements merging or contrasting.
COMPOSITION: Strong central focal point, dramatic scale contrasts, elements that create visual tension or harmony depending on the mood. Asymmetric but balanced.
COLOR: Limited bold palette (2-4 colors max), high contrast, could be vibrant or muted depending on emotional tone. Use color to reinforce mood - warm for hope/energy, cool for anxiety/calm, desaturated for melancholy.
FIGURES: Stylized human forms when needed - not realistic, more iconic/symbolic. Faceless or simple features. Could be silhouettes.
TEXTURE: Subtle grain or texture for depth, not flat digital. Paper-like quality.
TEXT: Only a short TITLE at top in elegant editorial typography. NO explanatory text, NO labels, NO annotations. The image speaks for itself.
TONE: Thought-provoking, sophisticated, emotionally resonant, magazine-worthy
EXAMPLES: A person drowning in email envelopes. A head made of tangled wires. A house of cards made of dollar bills. A heart with a loading spinner. A brain maze. A person climbing a bar chart mountain.
AVOID: Literal depictions, flowcharts, step-by-step diagrams, multiple labeled elements, busy compositions, clipart feel, generic stock photo concepts, photorealism`,

  roadmap: `Technical product architecture roadmap - a visual system diagram showing how to build something:
PURPOSE: Transform a product/project idea into a technical architecture visualization showing the BUILD LAYERS and how components connect. Think AWS architecture diagrams meets hand-drawn energy.
STRUCTURE: Break the input into logical TECHNICAL LAYERS arranged as connected system components:
  - Layer 1: Infrastructure (databases, servers, cloud services - show actual tech like PostgreSQL, Redis, AWS/Vercel)
  - Layer 2: Backend (APIs, services, authentication - show endpoints, middleware)
  - Layer 3: Integrations (third-party services - show actual logos/names like Stripe, Twilio, SendGrid)
  - Layer 4: Frontend (UI components, state management, routing)
  - Layer 5: DevOps (CI/CD, monitoring, deployment pipeline)
VISUAL STYLE: Technical but approachable - like a whiteboard architecture session. Show:
  - Boxes/containers for services and components with ACTUAL TECH NAMES (not generic "database" - say "PostgreSQL" or "MongoDB")
  - Arrows showing data flow between components
  - API endpoints illustrated (REST paths, webhooks)
  - Cloud provider elements if relevant (AWS S3 bucket, Vercel Edge, etc.)
LAYOUT: Left-to-right or layered top-to-bottom flow showing how data/requests move through the system
SPECIFIC TECH: If they mention specific technologies, SHOW THEM prominently:
  - "Stripe" → show Stripe logo/box with webhook arrows
  - "Next.js" → show as frontend container
  - "PostgreSQL" → show as database cylinder with schema hints
HAND-DRAWN ENERGY: Keep the sketchy, confident line style - not sterile corporate diagrams. Variable stroke weights, slight imperfection, warm colors for emphasis.
ANNOTATIONS: Include brief technical notes like "REST API", "WebSocket", "OAuth2", "JWT" near relevant components
TITLE: Bold project name at top with "Architecture Overview" or "System Design" subtitle
COLOR: Use color to distinguish layers - blues for infrastructure, greens for backend, oranges for frontend, purples for integrations
TONE: Technical but clear, something a developer would pin on their wall during a build
AVOID: Generic icons, cutesy illustrations, non-technical metaphors, vague labels like "magic happens here"`,

  infographic: `Clean modern infographic with hub-and-spoke layout radiating from a central concept:
BACKGROUND: Soft gradient from light lavender (#E8E4F0) to pale blue (#E0EAF5), clean and professional
LAYOUT: Central focal point (main concept) with branches/connections radiating outward to related topics. Hub-and-spoke or mind-map structure.
CONNECTORS: Subtle circuit-board style lines connecting elements - thin tech-inspired paths with small dots at connection points, soft gray or light blue (#B8C9DC)
ICONS: Colorful flat design icons with subtle drop shadows. Each concept gets a distinctive icon in a soft rounded container. Mix of:
  - Tech icons (brain, neural network, code brackets, screens, microphones, eyes, open books)
  - Friendly emoji-style characters where appropriate (excited yellow face with hands on cheeks)
  - Abstract symbols for concepts (gears, lightbulbs, charts)
COLOR PALETTE: Soft pastels with pops of vibrant color:
  - Primary: Soft purple (#9B7ED9), sky blue (#7EB3E0), mint green (#7ED9B3)
  - Accents: Warm yellow (#F5D76E), coral pink (#F5A07E), lavender (#B39DDB)
  - Each branch/category gets its own color family for visual distinction
TYPOGRAPHY: Clean sans-serif fonts. Bold headers for main concepts, lighter weight for descriptions. Dark gray text (#3D4852) for readability.
STYLE: Polished, professional, friendly. Think tech company explainer or online course landing page. NOT hand-drawn - clean vector aesthetic with smooth lines.
CENTRAL ELEMENT: Prominent focal point with a banner/ribbon containing the main concept word. Could include a friendly emoji character.
ELEMENTS: Rounded rectangles, soft drop shadows, subtle gradient fills on icons, clean thin borders
TONE: Educational, approachable, modern, trustworthy, optimistic
LAYOUT STRUCTURE: Central hub with 4-8 branches radiating to subtopics. Each subtopic has a colorful icon and clear label. Branches curve organically, not rigid straight lines.
AVOID: Harsh colors, sharp corners, cluttered layouts, hand-drawn/sketchy aesthetics, dark backgrounds, heavy gradients, busy patterns`,

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
ACCURACY REQUIREMENTS:
- Use EXACT FHIR resource names (Patient, Observation, Condition, Coverage, ExplanationOfBenefit, etc.)
- Use correct cardinality from FHIR spec
- For US Core profiles, show extensions: us-core-race, us-core-ethnicity, us-core-birthsex
- Reference targets must be valid (e.g., Condition.subject -> Reference(Patient|Group))
AVOID: Made-up resource names, incorrect cardinalities, ClinicalImpression for payer data, overly decorative elements.`,

  'fhir-workflow': `FHIR healthcare data flow diagram - swimlane process style:
PURPOSE: Show how FHIR resources flow between actors in healthcare workflows.
STYLE: Swimlane diagram with clear actor separation. Timeline flows left-to-right.
ACTORS: Horizontal lanes for each actor (Patient, Provider, Lab, Payer, etc.). Label lanes clearly.
RESOURCES: Show as document icons or boxes with resource name. Color by type.
API CALLS: Arrows between lanes showing REST operations (POST, GET, PUT). Label with operation.
COLOR PALETTE: Blues for clinical (#1E88E5), Greens for administrative (#43A047), Orange for financial (#FF7043).
TYPOGRAPHY: Actor names in bold. Resource names in regular. API verbs in monospace.
TITLE: Workflow name at top with problem statement below.

LAYOUT STRUCTURE:
1. Title + problem statement at very top
2. Numbered step summary (e.g., "1. Auth → 2. Match → 3. Retrieve → 4. Store") immediately below title as a roadmap
3. Detailed swimlane diagram below the step summary
4. The numbered steps help readers understand what they're about to see before diving into detail

VISUAL SIMPLICITY - CRITICAL:
- Show 4-6 KEY STEPS maximum in the main flow - this is an overview, not a spec
- One arrow per major interaction, not every API call
- Group related resources (e.g., "Clinical Data" instead of listing Condition, Procedure, Observation separately)
- Use simple labels: "Match Patient" not "POST Patient/$member-match with Parameters containing MemberPatient and CoverageToMatch"
- Technical details (operation names, parameters) go in small annotations OR a legend, not cluttering the main flow
- Generous whitespace between steps

ACCURACY REQUIREMENTS - CRITICAL:
- For PAYER-TO-PAYER exchange:
  1. Auth (OAuth/SMART)
  2. Member Match ($member-match)
  3. Consent verification
  4. Data retrieval ($everything or $export)
  5. Store with Provenance
- Claims/financial data = ExplanationOfBenefit
- Clinical summaries in payer context = grouped clinical resources OR DocumentReference to C-CDA, NOT ClinicalImpression
- NEVER use ClinicalImpression - it's for clinical decision support at point of care, NOT payer data exchange

AVOID: ClinicalImpression anywhere in payer workflows, direct Patient queries between payers, dense technical detail in main flow, more than 6 steps.`,

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
ACCURACY REQUIREMENTS:
- US Core Patient requires: identifier 1..*, name 1..*, gender 1..1
- US Core Patient extensions: us-core-race, us-core-ethnicity, us-core-birthsex, us-core-genderIdentity
- US Core Condition requires: category 1..*, code 1..1, subject 1..1
- Show correct IG source (US Core, Da Vinci PDex, CARIN BB, etc.)
- Terminology bindings: SNOMED for conditions, LOINC for observations, RxNorm for medications
AVOID: Incorrect cardinality constraints, missing standard extensions, wrong IG attribution.`,
};

const WATERMARK_TEXT = 'getclario.net';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { concept, style } = await request.json();

    if (!concept || typeof concept !== 'string') {
      return new Response('Missing concept', { status: 400 });
    }

    if (!style || !STYLE_PROMPTS[style]) {
      return new Response('Invalid style', { status: 400 });
    }

    // Log prompt for analytics
    console.log(JSON.stringify({
      event: 'generate_prompt',
      timestamp: new Date().toISOString(),
      prompt: concept,
      style: style,
      promptLength: concept.length,
    }));

    const apiKey = import.meta.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response('API key not configured', { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const stylePrompt = STYLE_PROMPTS[style];
    const fullPrompt = `${stylePrompt}

CONTENT TO ILLUSTRATE: ${concept}

Create a visual illustration that explains this concept clearly. The diagram MUST have:
1. A prominent TITLE at the top summarizing the concept (3-6 words)
2. A PROBLEM statement in smaller font below the title (one sentence explaining what problem this solves)
3. The main visual explanation below
4. A footer bar at the very bottom of the image with "${WATERMARK_TEXT}" - make it visible and readable (use a contrasting background strip if needed), positioned bottom-center. This is branding, so it should be noticeable but not overwhelming.

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
      return new Response('Failed to generate image', { status: 500 });
    }

    const imageUrl = `data:image/png;base64,${imageData}`;

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return new Response(
      error instanceof Error ? error.message : 'Generation failed',
      { status: 500 }
    );
  }
};
