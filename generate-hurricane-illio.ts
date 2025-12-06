import { GoogleGenAI } from '@google/genai';
import { writeFileSync, mkdirSync } from 'fs';

const ILLUSTRATIONS = [
  {
    id: 'formation',
    title: 'How Hurricanes Form',
    prompt: `Educational illustration showing hurricane formation process:
- Warm tropical ocean (80°F+) with sun heating the water
- Arrows showing warm moist air rising from ocean surface
- Air beginning to spin (show rotation arrows)
- Cloud formation building upward
- Labels: "Warm Ocean 80°F+", "Rising Air", "Rotation Begins", "Clouds Form"
Style: Simple, clear, educational diagram for kids. Bright colors, friendly style.`
  },
  {
    id: 'structure',
    title: 'Parts of a Hurricane',
    prompt: `Educational cross-section diagram of a hurricane showing its structure:
- Large spiral storm viewed from above AND side cutaway view
- Clear labels for: EYE (calm center, 20-40 miles wide), EYEWALL (strongest winds, darkest clouds), SPIRAL RAINBANDS (extending outward)
- Show the eye as calm with light/clear, eyewall as intense dark clouds with rain arrows
- Arrows showing wind direction (counterclockwise rotation)
- Size reference: "Can be 300+ miles wide"
Style: Clean educational diagram, vibrant colors, easy to understand for grades 4-6.`
  },
  {
    id: 'categories',
    title: 'Hurricane Categories 1-5',
    prompt: `Educational chart showing the Saffir-Simpson Hurricane Scale:
- 5 columns or sections, one for each category (1-5)
- Each category shows: wind speed range, simple icon showing damage level
- Category 1: 74-95 mph, minor damage (bent trees, some shingles)
- Category 2: 96-110 mph, moderate damage (more tree damage, roof damage)
- Category 3: 111-129 mph, major damage (trees down, structural damage)
- Category 4: 130-156 mph, severe damage (roofs gone, trees snapped)
- Category 5: 157+ mph, catastrophic (total destruction)
- Color gradient from yellow (Cat 1) to dark red (Cat 5)
Style: Infographic style, clear comparison, kid-friendly icons showing increasing severity.`
  },
  {
    id: 'storm-surge',
    title: 'What is Storm Surge?',
    prompt: `Educational illustration explaining storm surge:
- Cross-section view of coastline with ocean
- Normal water level line marked
- Hurricane over water with arrows pushing water toward shore
- Dome of water rising 10-20+ feet above normal
- Coastal buildings/homes with water reaching them
- Labels: "Normal Sea Level", "Storm Surge (10-20+ feet)", "Hurricane Winds Push Water"
- Show the danger clearly but not scary for kids
Style: Clear educational diagram, shows the concept simply, appropriate for grades 4-6.`
  },
  {
    id: 'preparation',
    title: 'Hurricane Safety & Preparation',
    prompt: `Educational illustration showing hurricane preparation and safety:
- Split into sections showing different preparation steps:
- Family stocking supplies (water bottles, canned food, flashlight, batteries)
- Person boarding up windows with plywood
- Family in car evacuating (road sign pointing to "Safety")
- TV/radio showing weather warning
- Emergency kit checklist
- Labels for each action
Style: Friendly, encouraging (not scary), shows families being prepared and safe. Kid-friendly, educational.`
  }
];

const STYLE_PROMPT = `Visual thinking illustration with confident hand-drawn energy:
DRAWING: Bold sketchy linework with confident variable strokes, thicker lines for emphasis
COLOR: Vibrant saturated palette - primary blue (#1E88E5), energetic orange (#FF7043), fresh green (#43A047), warm coral (#FF5252) as accent. White background
FIGURES: Expressive rounded characters with personality - simple but not stick figures, friendly
COMPOSITION: Clear visual flow, important elements larger, generous whitespace
TEXT: Bold hand-lettered titles, clean labels for clarity
TONE: Educational, approachable, confident, clear - appropriate for students grades 4-6
AVOID: Scary imagery, corporate clip-art, cramped layouts, dull colors`;

async function generateIllustration(ai: GoogleGenAI, illio: typeof ILLUSTRATIONS[0]): Promise<Buffer | null> {
  const fullPrompt = `${STYLE_PROMPT}

${illio.prompt}

Create an educational illustration with:
1. A clear TITLE at the top: "${illio.title}"
2. The main visual content as described
3. Clear labels and annotations
4. A small "getclario.net" watermark in the bottom corner

This is for an educational reading passage about hurricanes for grades 4-6. Make it engaging and easy to understand.`;

  console.log(`Generating: ${illio.title}...`);

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

  mkdirSync('./public/tpt/hurricanes', { recursive: true });

  const ai = new GoogleGenAI({ apiKey });

  for (const illio of ILLUSTRATIONS) {
    try {
      const imageBuffer = await generateIllustration(ai, illio);
      if (imageBuffer) {
        const outputPath = `./public/tpt/hurricanes/${illio.id}.png`;
        writeFileSync(outputPath, imageBuffer);
        console.log(`  Saved: ${outputPath}`);
      } else {
        console.error(`  Failed to generate ${illio.title}`);
      }
    } catch (error) {
      console.error(`  Error generating ${illio.title}:`, error);
    }
  }

  console.log('\nDone! Generated 5 hurricane illustrations.');
}

main();
