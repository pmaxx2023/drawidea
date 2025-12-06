import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'fs';

const CONCEPT = `How WiFi works: Router receives internet signal from modem, broadcasts radio waves throughout the space, devices (phones, laptops, tablets) detect the signal and connect wirelessly, data flows back and forth between devices and router. Show a home with router in center and devices around it connecting via invisible waves.`;

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
};

const WATERMARK_TEXT = 'getclario.net';

const STYLE_NAMES: Record<string, string> = {
  xplane: 'XPLANE Visual Thinking',
  tron: 'Tron Dark Whiteboard',
  'minimal-line': 'Minimal Line Art',
  woodcut: 'Woodcut Print',
  risograph: 'Risograph Editorial',
  editorial: 'Magazine Editorial',
  roadmap: 'Technical Roadmap',
  infographic: 'Modern Infographic',
};

async function generateStyle(ai: GoogleGenAI, style: string): Promise<Buffer | null> {
  const stylePrompt = STYLE_PROMPTS[style];
  const fullPrompt = `${stylePrompt}

CONTENT TO ILLUSTRATE: ${CONCEPT}

Create a visual illustration that explains this concept clearly. The diagram MUST have:
1. A prominent TITLE at the top summarizing the concept (3-6 words)
2. A PROBLEM statement in smaller font below the title (one sentence explaining what problem this solves)
3. The main visual explanation below
4. A footer bar at the very bottom of the image with "${WATERMARK_TEXT}" - make it visible and readable (use a contrasting background strip if needed), positioned bottom-center. This is branding, so it should be noticeable but not overwhelming.

Include short hand-written labels and annotations where helpful to clarify key elements. The illustration should be immediately understandable and capture the core idea.`;

  console.log(`Generating ${STYLE_NAMES[style]}...`);

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

  if (response.candidates && response.candidates.length > 0) {
    const parts = response.candidates[0].content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return Buffer.from(part.inlineData.data, 'base64');
      }
    }
  }

  return null;
}

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_API_KEY not set');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  const styles = Object.keys(STYLE_PROMPTS);

  for (const style of styles) {
    try {
      const imageBuffer = await generateStyle(ai, style);
      if (imageBuffer) {
        const outputPath = `./public/styles/wifi-${style}.png`;
        writeFileSync(outputPath, imageBuffer);
        console.log(`  Saved: ${outputPath}`);
      } else {
        console.error(`  Failed to generate ${style}`);
      }
    } catch (error) {
      console.error(`  Error generating ${style}:`, error);
    }
  }

  console.log('\nDone!');
}

main();
