import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

// Auth disabled - anonymous usage allowed

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

  architecture: `System architecture reasoning diagram - focus on WHAT and WHY, not infrastructure plumbing:
PURPOSE: Generate a clean, complete architecture showing services, flows, and purpose. This is the REASONING layer - get the design decisions right. Infrastructure details come later.

REQUIREMENTS:
1. Every service node must have a PURPOSE label (what it does, not just its name)
2. Every edge must be labeled with WHAT flows (data type, action, protocol)
3. Every flow must TERMINATE somewhere (no dead ends, no orphans)
4. Pick ONE compute path per request type (don't hedge with multiple options)
5. Async paths (queues, events) must show producer AND consumer
6. Security services (auth, WAF) shown as explicit flow steps, not side decorations

STRUCTURE:
- INGRESS: How requests enter (DNS → CDN → Auth → Compute)
- COMPUTE: Single layer per request type with clear purpose
- DATA: Storage services with read/write distinction
- ASYNC: Background processing with complete producer→queue→consumer chains
- EGRESS: How responses/notifications leave

VISUAL STYLE:
- Clean boxes for services with bold labels
- Directional arrows with flow labels
- Color coding by function (compute=orange, data=blue, async=pink, security=red)
- Clear visual separation between sync request path and async event path

LABELS (required on every element):
- Services: "Lambda: Process Orders" not just "Lambda"
- Edges: "POST /order" or "order.created event" not just arrows
- Queues: Show message type "OrderCreatedEvent"

TITLE: System name at top
PROBLEM: One line explaining what this system does

OUTPUT: A complete, coherent architecture where a developer could trace any request from ingress to final storage/response.

AVOID: VPC/subnet details, AZ placement, port numbers, security group rules, instance types - those are infrastructure, not architecture. Also avoid: orphan services, unlabeled edges, dead-end flows, duplicate services without distinct purposes.`,

  aws: `AWS architecture diagram - professional cloud infrastructure visualization:
PURPOSE: Create an architecturally CORRECT AWS diagram. This is not decoration - it must represent real, deployable infrastructure.

CRITICAL ARCHITECTURE RULES (MUST FOLLOW):
1. API Gateway is ALWAYS an entry point to compute (Lambda/ECS), NEVER behind it
2. Pick ONE compute layer per request type: Lambda OR ECS OR EC2, not multiple handling the same request
3. Web/app servers go in PRIVATE subnets behind ALB, not public subnets
4. Only bastion hosts, NAT gateways, and ALBs belong in public subnets
5. Every write operation must show complete path to database (no flows ending at Lambda with no storage)
6. Async services (SQS, SNS, EventBridge) must show both producer AND consumer
7. ONE CloudFront distribution per origin type - never duplicate
8. Managed services (CloudFront, Route53, API Gateway, S3) are REGIONAL, not inside VPC boxes

CORRECT INGRESS PATTERNS:
- Web app: Route53 → CloudFront → WAF → ALB → [Private subnet: EC2/ECS] → [Private subnet: RDS]
- Serverless API: Route53 → API Gateway → Lambda → DynamoDB
- Static site: Route53 → CloudFront → S3

PLACEMENT RULES:
- VPC contains: Subnets (public/private), EC2, ECS tasks, RDS, ElastiCache, Lambda (if VPC-connected)
- OUTSIDE VPC: CloudFront, Route53, S3, DynamoDB, API Gateway, Cognito, CloudWatch, SNS, SQS

VISUAL STYLE: Clean AWS reference architecture style with official service colors:
- Compute (orange): EC2, Lambda, ECS
- Database (blue): RDS, DynamoDB, ElastiCache
- Network (purple): VPC, ALB, CloudFront, Route53, API Gateway
- Security (red): IAM, Cognito, WAF, KMS
- Integration (pink): SQS, SNS, EventBridge, Step Functions
- Storage (green): S3, EBS, EFS

LAYOUT:
- Left-to-right or top-to-bottom data flow
- Clear VPC boundary with public/private subnet zones
- Availability zones shown as vertical columns within VPC
- External services (CDN, DNS, auth) outside VPC boundary
- Clean arrows showing request flow, labeled with protocols (HTTPS, gRPC, etc.)

LABELS: Use actual AWS service names (not generic "database" - say "RDS PostgreSQL" or "DynamoDB")
TITLE: Architecture name at top
AVOID: Generic icons, services inside wrong boundaries, duplicate services without justification, incomplete flows, API Gateway behind compute`,

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

CLOUD ARCHITECTURE RULES (if AWS/GCP/Azure services mentioned):
- API Gateway/Cloud Functions entry point: Always at the TOP of the flow, routing TO compute
- ONE compute path per request type: Don't show both Lambda AND EC2 handling the same /api/products request
- Complete data flows: Every write must show the path to persistent storage (database)
- Public vs Private: Load balancers public-facing, app servers behind them, databases furthest back
- Async services (queues, events): Must show what PRODUCES and what CONSUMES messages

AVOID: Generic icons, cutesy illustrations, non-technical metaphors, vague labels like "magic happens here", architecturally incorrect flows (API Gateway behind Lambda, web servers in front of load balancer)`,

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
- For PAYER-TO-PAYER exchange, there are TWO DISTINCT AUTHORIZATION LAYERS that must be shown separately:

  PHASE 1 - PATIENT CONSENT (Business/Legal - happens first, could be days/weeks before technical exchange):
  - Patient enrolls with New Payer (Payer B)
  - Patient provides Old Payer (Payer A) member information
  - Patient signs consent authorizing data transfer → Consent resource created
  - This is in the PATIENT lane, initiating the whole process

  PHASE 2 - TECHNICAL EXCHANGE (System-to-system - happens after consent exists):
  1. Payer B authenticates to Payer A (OAuth/SMART Backend Services) - this is SYSTEM auth, not patient auth
  2. Payer B calls $member-match (includes reference to Consent)
  3. Payer A validates consent exists and is active
  4. Payer B retrieves data ($everything or $export)
  5. Payer B stores with Provenance

- Show clear visual separation between Phase 1 (patient-initiated) and Phase 2 (system-to-system)
- Use timeline or phase markers to show these happen at different times
- Claims/financial data = ExplanationOfBenefit
- Clinical summaries = grouped clinical resources OR DocumentReference, NOT ClinicalImpression
- NEVER use ClinicalImpression

AVOID: Conflating patient consent with system authentication, ClinicalImpression anywhere, direct Patient queries between payers.`,

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

// Styles that require two-pass generation (architecture reasoning first)
const TWO_PASS_STYLES = ['aws'];

// Image analysis prompt - extract architecture from pasted diagram
const IMAGE_ANALYSIS_PROMPT = `Analyze this architecture diagram and extract its structure.

OUTPUT FORMAT (strict):
---
TITLE: [System name from diagram, or infer from content]
PROBLEM: [What problem does this system solve - infer from the architecture]

SERVICES:
- [ServiceName]: [Purpose - what it does based on its position and connections]
...

FLOWS:
1. [FlowName]: [Trace the arrows/connections from entry to exit]
...

ASYNC_PATHS:
- [Any queues, events, or async processing paths visible]
...

SECURITY:
- Auth: [Any auth services visible - Cognito, IAM, etc.]
- Protection: [WAF, firewalls, shields visible]

DATA:
- [Databases visible]: [What they likely store based on connections]
...

NOTES:
- [Any text labels, annotations, or notes visible in the diagram]
---

Extract EVERYTHING visible. Include service names exactly as labeled.
If arrows have labels, include those labels in the flows.
If you can't determine something, make reasonable inferences based on typical patterns.`;

/**
 * Analyze an image to extract architecture structure
 */
async function analyzeImage(
  ai: InstanceType<typeof GoogleGenAI>,
  imageData: string,
  mimeType: string
): Promise<string | null> {
  console.log('Analyzing input image...');

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{
      parts: [
        { text: IMAGE_ANALYSIS_PROMPT },
        {
          inlineData: {
            mimeType: mimeType,
            data: imageData,
          },
        },
      ],
    }],
  });

  if (response.candidates && response.candidates.length > 0) {
    const parts = response.candidates[0].content?.parts || [];
    for (const part of parts) {
      if ('text' in part && part.text) {
        console.log('Image analysis complete:', part.text.substring(0, 200) + '...');
        return part.text;
      }
    }
  }

  console.error('Image analysis failed');
  return null;
}

// Architecture reasoning prompt for pass 1 (text output)
const ARCHITECTURE_REASONING_PROMPT = `You are a cloud architect. Analyze this system and output a STRUCTURED ARCHITECTURE DESCRIPTION.

OUTPUT FORMAT (strict):
---
TITLE: [3-6 word system name]
PROBLEM: [One sentence - what problem does this solve]

SERVICES:
- [ServiceName]: [Purpose - what it does, not what it is]
- [ServiceName]: [Purpose]
...

FLOWS:
1. [FlowName]: [Source] → [Action/Data] → [Destination] → [Action/Data] → [Final Destination]
2. [FlowName]: [Complete path with labeled edges]
...

ASYNC_PATHS:
- [Producer] → [Queue/Event: message type] → [Consumer] → [Storage]
...

SECURITY:
- Auth: [How users authenticate]
- Protection: [WAF, Shield, etc. and where in the flow]

DATA:
- [Database]: [What data, read/write pattern]
...
---

RULES:
1. Every flow must TERMINATE at storage or response
2. ONE compute choice per flow (Lambda OR ECS OR EC2, not multiple)
3. Every async path shows producer AND consumer
4. Every service has a PURPOSE, not just a name
5. Security services are flow steps, not side notes

Be specific. Be complete. No orphans. No dead ends.`;

/**
 * Two-pass generation for styles that need architecture reasoning first
 * Pass 1: Generate structured architecture (text)
 * Pass 2: Render with target visual style (image)
 */
async function generateTwoPass(
  ai: InstanceType<typeof GoogleGenAI>,
  concept: string,
  targetStyle: string
): Promise<string | null> {
  // Pass 1: Architecture reasoning (text only)
  console.log('Pass 1: Generating architecture reasoning...');

  const pass1Response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ parts: [{ text: `${ARCHITECTURE_REASONING_PROMPT}\n\nSYSTEM TO ARCHITECT:\n${concept}` }] }],
  });

  let architectureReasoning = '';
  if (pass1Response.candidates && pass1Response.candidates.length > 0) {
    const parts = pass1Response.candidates[0].content?.parts || [];
    for (const part of parts) {
      if ('text' in part && part.text) {
        architectureReasoning = part.text;
        break;
      }
    }
  }

  if (!architectureReasoning) {
    console.error('Pass 1 failed: No architecture reasoning generated');
    return null;
  }

  console.log('Pass 1 complete. Architecture reasoning:', architectureReasoning.substring(0, 200) + '...');

  // Pass 2: Render with target style (image)
  console.log('Pass 2: Rendering with', targetStyle, 'style...');

  const stylePrompt = STYLE_PROMPTS[targetStyle];
  const pass2Prompt = `${stylePrompt}

ARCHITECTURE TO RENDER (already validated - do not change the services or flows, only visualize them):

${architectureReasoning}

RENDERING INSTRUCTIONS:
- Use EXACTLY the services listed above
- Use EXACTLY the flows listed above
- Do NOT add services that aren't in the architecture
- Do NOT remove or simplify flows
- Apply the visual style to this pre-defined architecture

Create the visual diagram with:
1. TITLE at top (from architecture above)
2. PROBLEM statement below title (from architecture above)
3. Main diagram visualizing the exact services and flows specified
4. Footer bar at bottom with "${WATERMARK_TEXT}"`;

  const pass2Response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ parts: [{ text: pass2Prompt }] }],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio: '16:9',
        imageSize: '2K',
      },
    },
  });

  if (pass2Response.candidates && pass2Response.candidates.length > 0) {
    const parts = pass2Response.candidates[0].content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        console.log('Pass 2 complete. Image generated.');
        return part.inlineData.data;
      }
    }
  }

  console.error('Pass 2 failed: No image generated');
  return null;
}

/**
 * Single-pass generation for styles that don't need architecture reasoning
 */
async function generateSinglePass(
  ai: InstanceType<typeof GoogleGenAI>,
  concept: string,
  style: string
): Promise<string | null> {
  const stylePrompt = STYLE_PROMPTS[style];
  const fullPrompt = stylePrompt + '\n\nCONTENT TO ILLUSTRATE: ' + concept + '\n\nCreate a visual illustration that explains this concept clearly. The diagram MUST have:\n1. A prominent TITLE at the top summarizing the concept (3-6 words)\n2. A PROBLEM statement in smaller font below the title (one sentence explaining what problem this solves)\n3. The main visual explanation below\n4. A footer bar at the very bottom of the image with "' + WATERMARK_TEXT + '" - make it visible and readable (use a contrasting background strip if needed), positioned bottom-center. This is branding, so it should be noticeable but not overwhelming.\n\nInclude short hand-written labels and annotations where helpful to clarify key elements. The illustration should be immediately understandable and capture the core idea.';

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
        return part.inlineData.data;
      }
    }
  }

  return null;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { concept, style, image, imageMimeType } = body as {
      concept?: string;
      style: string;
      image?: string; // base64 image data (without data:image/... prefix)
      imageMimeType?: string; // e.g., 'image/png', 'image/jpeg'
    };

    // Must have either concept (text) or image
    if ((!concept || typeof concept !== 'string') && !image) {
      return new Response(JSON.stringify({ error: 'Missing concept or image' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!style || !STYLE_PROMPTS[style]) {
      return new Response(JSON.stringify({ error: 'Invalid style' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = import.meta.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response('API key not configured', { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // If image provided, analyze it first to extract architecture
    let effectiveConcept = concept || '';
    let hasImageInput = false;

    if (image) {
      hasImageInput = true;
      const mimeType = imageMimeType || 'image/png';
      const extractedArchitecture = await analyzeImage(ai, image, mimeType);

      if (!extractedArchitecture) {
        return new Response(JSON.stringify({ error: 'Failed to analyze image' }), {
          status: 500, headers: { 'Content-Type': 'application/json' }
        });
      }

      // Combine extracted architecture with any additional text concept
      if (concept) {
        effectiveConcept = `USER REQUEST: ${concept}\n\nEXTRACTED FROM IMAGE:\n${extractedArchitecture}`;
      } else {
        effectiveConcept = `EXTRACTED FROM IMAGE:\n${extractedArchitecture}`;
      }
    }

    const isTwoPass = TWO_PASS_STYLES.includes(style);

    console.log(JSON.stringify({
      event: 'generate_prompt',
      timestamp: new Date().toISOString(),
      prompt: effectiveConcept.substring(0, 500),
      style,
      promptLength: effectiveConcept.length,
      twoPass: isTwoPass,
      hasImageInput,
    }));

    // Use two-pass for AWS style, single-pass for others
    const imageData = isTwoPass
      ? await generateTwoPass(ai, effectiveConcept, style)
      : await generateSinglePass(ai, effectiveConcept, style);

    if (!imageData) {
      return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      });
    }

    const imageUrl = 'data:image/png;base64,' + imageData;

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Generation failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
