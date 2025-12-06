import { GoogleGenAI } from '@google/genai';
import { writeFileSync, mkdirSync } from 'fs';

const MODELS = [
  {
    id: 'first-principles',
    name: 'First Principles Thinking',
    concept: `First Principles Thinking: Break down complex problems to their most fundamental truths, then rebuild solutions from scratch. Instead of reasoning by analogy ("this is how it's always been done"), question every assumption until you reach bedrock facts. Example: Elon Musk asked "What are batteries made of?" instead of "How much do batteries cost?" - and found materials cost was 1/10th the battery price. Show a person deconstructing a complex machine into basic building blocks, then reassembling them into something new and better.`
  },
  {
    id: 'inversion',
    name: 'Inversion',
    concept: `Inversion: Instead of asking "How do I succeed?", ask "What would guarantee failure?" Then avoid those things. Think backwards. Charlie Munger: "All I want to know is where I'm going to die, so I'll never go there." Show two paths - one person running toward a goal, another person identifying and avoiding all the pitfalls/traps/obstacles. The second approach is often more effective.`
  },
  {
    id: 'second-order-thinking',
    name: 'Second-Order Thinking',
    concept: `Second-Order Thinking: First-order thinking asks "What happens next?" Second-order thinking asks "And then what?" Most people stop at the immediate consequence. Wise decisions consider the consequences of consequences. Example: Rent control (1st order: cheaper rent! 2nd order: less housing built, longer waitlists, worse maintenance). Show a chain of dominoes or ripple effects - first action leads to consequence which leads to another consequence which leads to another.`
  },
  {
    id: 'pareto-principle',
    name: 'Pareto Principle (80/20 Rule)',
    concept: `Pareto Principle: 80% of results come from 20% of efforts. 80% of sales come from 20% of customers. 80% of bugs come from 20% of code. The vital few vs the trivial many. Don't treat all inputs equally - identify and focus on the high-leverage 20%. Show a visual contrast: a small portion (20%) producing most of the output, while the large portion (80%) produces little. Could be depicted as unequal bar charts, or a funnel, or workers where a few do most of the heavy lifting.`
  },
  {
    id: 'circle-of-competence',
    name: 'Circle of Competence',
    concept: `Circle of Competence: Know the boundaries of what you truly understand vs what you only think you understand. Inside the circle: areas where you have real expertise, earned through experience. Outside: where you're a tourist, prone to overconfidence. Success comes from operating inside your circle AND knowing exactly where the edge is. Warren Buffett only invests in businesses he deeply understands. Show a person standing confidently inside a circle, with clear boundaries. Outside the circle is foggy/dangerous/uncertain territory.`
  }
];

const STYLE_PROMPT = `Visual thinking illustration with confident hand-drawn energy:
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
AVOID: Stiff corporate clip-art, flat lifeless icons, cramped layouts, muted washed-out colors, perfectly straight mechanical lines, generic stock illustration feel`;

const WATERMARK = 'getclario.net';

async function generateModel(ai: GoogleGenAI, model: typeof MODELS[0]): Promise<Buffer | null> {
  const fullPrompt = `${STYLE_PROMPT}

CONTENT TO ILLUSTRATE: ${model.concept}

Create a visual illustration that explains this mental model clearly. The diagram MUST have:
1. A prominent TITLE at the top: "${model.name}" in bold hand-lettered style
2. A PROBLEM statement in smaller font below the title (one sentence explaining what problem this mental model solves)
3. The main visual explanation below
4. A footer bar at the very bottom of the image with "${WATERMARK}" - make it visible and readable (use a contrasting background strip if needed), positioned bottom-center.

Include short hand-written labels and annotations where helpful to clarify key elements. The illustration should be immediately understandable and capture the core idea of this mental model.`;

  console.log(`Generating ${model.name}...`);

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

  mkdirSync('./public/mental-models', { recursive: true });

  const ai = new GoogleGenAI({ apiKey });

  for (const model of MODELS) {
    try {
      const imageBuffer = await generateModel(ai, model);
      if (imageBuffer) {
        const outputPath = `./public/mental-models/${model.id}.png`;
        writeFileSync(outputPath, imageBuffer);
        console.log(`  Saved: ${outputPath}`);
      } else {
        console.error(`  Failed to generate ${model.name}`);
      }
    } catch (error) {
      console.error(`  Error generating ${model.name}:`, error);
    }
  }

  console.log('\nDone! Generated 5 mental model visuals.');
}

main();
