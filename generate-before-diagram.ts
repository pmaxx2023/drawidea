import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function generateBadDiagram() {
  const prompt = `Create an intentionally BAD, confusing diagram that looks like someone struggling in PowerPoint or MS Paint tried to explain "Payer-to-Payer Health Data Exchange".

This should look like a FAILED ATTEMPT at explaining a complex concept:
- Messy arrows going everywhere, crossing over each other
- Inconsistent shapes (mix of circles, squares, random shapes)
- Too much text crammed into small boxes
- Bad color choices (clashing colors, hard to read)
- Unclear flow - you can't tell where to start or what connects to what
- Random clipart-style icons that don't quite fit
- Some text cut off or overlapping
- Misaligned elements
- Maybe a few question marks or "???" showing confusion
- Labels like "data goes here?" or arrows labeled "somehow?"

Include these elements but make them confusing:
- Payer A and Payer B
- Patient/Member
- FHIR API (but maybe misspelled or unclear)
- Data types (claims, clinical, etc) but jumbled
- CMS requirement reference but buried/hard to find

Style: Like a stressed-out analyst made this at 11pm the night before a presentation. White or light gray background. The kind of diagram that makes you say "I have no idea what I'm looking at."

Make it look genuinely bad but believable - like real corporate PowerPoint struggles.`;

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
      fs.writeFileSync("public/before-p2p-bad.png", buffer);
      console.log("Saved: public/before-p2p-bad.png");
    }
  }
}

generateBadDiagram().catch(console.error);
