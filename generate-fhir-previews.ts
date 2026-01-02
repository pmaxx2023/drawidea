import { GoogleGenAI } from '@google/genai';

const FHIR_PREVIEWS = [
  {
    filename: 'fhir-technical.png',
    style: 'fhir-technical',
    concept: 'US Core Patient profile showing required elements like identifier, name, gender, and extensions like us-core-race and us-core-ethnicity'
  },
  {
    filename: 'fhir-workflow.png',
    style: 'fhir-workflow',
    concept: 'Payer to payer data exchange workflow showing patient consent, member matching, and clinical data transfer between health plans'
  },
  {
    filename: 'fhir-hierarchy.png',
    style: 'fhir-hierarchy',
    concept: 'FHIR Patient resource profile hierarchy showing inheritance from base Patient to US Core Patient to Da Vinci PDex Member'
  }
];

const STYLE_PROMPTS: Record<string, string> = {
  'fhir-technical': `FHIR healthcare data standard technical diagram - clean architectural style:
PURPOSE: Visualize FHIR resources, profiles, and data structures with medical precision.
STYLE: Clean technical diagram like software architecture docs. Professional, precise.
RESOURCES: Show as rounded rectangles with resource name as header. Elements listed inside with data types.
CARDINALITY: Always show cardinality notation (0..1, 1..1, 0..*, 1..*) next to elements.
COLOR CODING: Required elements in solid blue (#1E88E5), Optional in light gray (#9E9E9E), Extensions in orange (#FF7043), Must Support with green checkmark (#43A047).
REFERENCES: Arrows between resources showing Reference() relationships. Label arrows with element name.
SECTIONS: Group elements logically - identifiers, demographics, clinical, administrative.
TYPOGRAPHY: Clean sans-serif. Resource names bold. Element names in monospace font.
LAYOUT: Title at top with IG name if applicable. Main diagram below. Legend for color coding.`,

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
2. Numbered step summary immediately below title as a roadmap
3. Detailed swimlane diagram below the step summary`,

  'fhir-hierarchy': `FHIR profile inheritance and extension hierarchy diagram - tree structure style:
PURPOSE: Show how FHIR profiles inherit from base resources and add constraints/extensions.
STYLE: Top-down tree diagram showing inheritance relationships.
BASE: Root node shows base FHIR resource (e.g., Patient, Observation).
PROFILES: Child nodes show derived profiles. Connect with solid lines.
CONSTRAINTS: Show key constraints added at each level (cardinality changes, terminology bindings).
EXTENSIONS: Show extension additions in orange boxes attached to profile nodes.
INHERITANCE: Arrow direction shows "inherits from" relationship (child -> parent).
COLOR CODING: Base resources in gray, US Core profiles in blue, IG-specific profiles in teal, Extensions in orange.
TYPOGRAPHY: Profile names in bold. Constraint summaries in smaller text.`
};

const WATERMARK_TEXT = 'getclario.net';

async function generatePreview(preview: { filename: string; style: string; concept: string }) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_API_KEY not set');
    process.exit(1);
  }

  console.log(`Generating: ${preview.filename}`);

  const ai = new GoogleGenAI({ apiKey });
  const stylePrompt = STYLE_PROMPTS[preview.style];

  const fullPrompt = `${stylePrompt}

CONTENT TO ILLUSTRATE: ${preview.concept}

Create a visual illustration that explains this concept clearly. The diagram MUST have:
1. A prominent TITLE at the top summarizing the concept (3-6 words)
2. A PROBLEM statement in smaller font below the title (one sentence explaining what problem this solves)
3. The main visual explanation below
4. A footer bar at the very bottom of the image with "${WATERMARK_TEXT}" - make it visible and readable.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: { responseModalities: ['TEXT', 'IMAGE'] }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        const imageData = Buffer.from(part.inlineData.data, 'base64');
        await Bun.write(`public/styles/${preview.filename}`, imageData);
        console.log(`  Saved: public/styles/${preview.filename}`);
        return true;
      }
    }
    console.error(`  No image in response for ${preview.filename}`);
    return false;
  } catch (error) {
    console.error(`  Failed: ${preview.filename}`, error);
    return false;
  }
}

async function main() {
  console.log('=== FHIR Style Preview Generation ===\n');

  for (const preview of FHIR_PREVIEWS) {
    await generatePreview(preview);
    await Bun.sleep(2000); // Rate limit
  }

  console.log('\nDone!');
}

main();
