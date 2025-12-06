import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'fs';

const COVER_PROMPT = `Create a professional TPT (Teachers Pay Teachers) product cover image:

PRODUCT: "Hurricanes: Differentiated Reading Passages"
SUBTITLE: "5 Lexile Levels for Grades 4-6"
FEATURES TO HIGHLIGHT:
- "5 Reading Levels" (with level icons 1-2-3-4-5)
- "5 Illustrations Included"
- "Comprehension Questions"
- "Answer Key Included"

DESIGN STYLE:
- Clean, professional teacher resource aesthetic
- Bold title at top
- Eye-catching hurricane visual (educational, not scary)
- Feature badges/icons showing what's included
- Grade level badge "Grades 4-6"
- Color scheme: Blues, teals, and orange accents
- Modern, polished look that stands out in TPT search results

LAYOUT:
- Product title prominent at top
- Central hurricane illustration (friendly/educational style)
- Feature callouts around the edges
- "DIFFERENTIATED" as a key selling point badge
- Clean white or light background areas for readability

This should look like a premium TPT product that teachers would click on. Professional but approachable.`;

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_API_KEY not set');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log('Generating TPT cover image...');

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ parts: [{ text: COVER_PROMPT }] }],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio: '1:1',
        imageSize: '2K',
      },
    },
  });

  if (response.candidates && response.candidates.length > 0) {
    const parts = response.candidates[0].content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        writeFileSync('./public/tpt/hurricanes/cover.png', buffer);
        console.log('Saved: ./public/tpt/hurricanes/cover.png');
        return;
      }
    }
  }

  console.error('Failed to generate cover');
}

main();
