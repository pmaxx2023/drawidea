import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'fs';

const PREVIEWS = [
  {
    id: 'preview-levels',
    prompt: `Create a TPT preview image showing the 5 differentiated reading levels:

TITLE: "5 Lexile Levels Included"

Show a visual comparison of the 5 reading levels side by side:
- Level 1: 450-550L "Intervention" (shortest text sample)
- Level 2: 600-700L "Approaching"
- Level 3: 750-850L "On Grade Level"
- Level 4: 900-950L "Above Grade Level"
- Level 5: 1000-1100L "Advanced" (longest text sample)

Design: Clean layout showing page thumbnails or text blocks getting progressively longer/more complex. Use color coding (light to dark blue gradient). Professional teacher resource style.

Include callout: "Same content, different complexity levels - perfect for mixed-ability classrooms!"`,
  },
  {
    id: 'preview-whats-included',
    prompt: `Create a TPT preview image showing "What's Included" in this product:

TITLE: "What's Included"

Show icons/thumbnails for:
✓ 5 Differentiated Reading Passages (show stack of papers)
✓ 5 Educational Illustrations (show small image thumbnails)
✓ 5 Comprehension Questions (show question marks)
✓ Complete Answer Key (show checkmark/key icon)
✓ Teacher Notes with Standards Alignment (show clipboard)

Design: Clean checklist style with icons. Professional TPT aesthetic. Blue and teal color scheme. Each item clearly visible and labeled.`,
  },
  {
    id: 'preview-sample',
    prompt: `Create a TPT preview image showing a sample passage page layout:

TITLE: "Sample Passage Page"

Show a mockup of what a passage page looks like:
- Header with reading level indicator (e.g., "Level 3: On Grade Level")
- Lexile badge "750-850L"
- Passage title "Hurricanes: Nature's Most Powerful Storms"
- Sample paragraph of text (can be placeholder/lorem ipsum style)
- Clean, easy-to-read formatting
- Page number at bottom

Design: Looks like an actual worksheet/passage page. Clean white background, professional fonts, organized layout. Shows teachers exactly what they're getting.`,
  },
];

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_API_KEY not set');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  for (const preview of PREVIEWS) {
    console.log(`Generating ${preview.id}...`);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ parts: [{ text: preview.prompt }] }],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: '4:3',
          imageSize: '2K',
        },
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          writeFileSync(`./public/tpt/hurricanes/${preview.id}.png`, buffer);
          console.log(`  Saved: ./public/tpt/hurricanes/${preview.id}.png`);
          break;
        }
      }
    }
  }

  console.log('\nDone! Generated preview images.');
}

main();
