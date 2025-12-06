import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function generateBeforeAfter() {
  const prompt = `Create a side-by-side comparison graphic for LinkedIn with this exact layout:

LEFT HALF - "BEFORE" section:
- Red "X" icon and "BEFORE" text at top
- Show a MESSY, CHAOTIC diagram attempt about "Payer-to-Payer Data Exchange"
- Arrows going everywhere, crossing each other
- Mismatched shapes and colors (purple, orange, pink boxes randomly)
- Text that's hard to read, overlapping
- A confused stick figure with "?" above their head
- Labels like "Payer A", "Payer B", "FHIR??", "data goes here?"
- Looks like someone struggled in PowerPoint at 11pm

RIGHT HALF - "AFTER" section:  
- Green checkmark icon and "AFTER" text at top
- Show a CLEAN, PROFESSIONAL infographic about "Payer-to-Payer Data Exchange"
- Central hub design with organized spokes radiating out
- Consistent pastel color scheme (light blue, purple, orange, green sections)
- Clear icons with emojis (💻, 📋, ✅, 🏥)
- Organized categories: "How it Works", "Key Requirements", "Data Included", "Benefits"
- Clean typography, proper alignment
- Professional and easy to understand

DIVIDER: Gray vertical line or arrow "→" between the two halves

Overall:
- White/light background
- LinkedIn-optimized landscape ratio (1200x627)
- The contrast should be DRAMATIC - chaos vs clarity
- Make it obvious this is a transformation`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: ["image", "text"],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      fs.writeFileSync("public/linkedin-before-after-v2.png", buffer);
      console.log("Saved: public/linkedin-before-after-v2.png");
    }
  }
}

generateBeforeAfter().catch(console.error);
