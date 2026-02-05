
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async *streamChatResponse(message: string) {
    const ai = this.getClient();
    
    try {
      const config: any = {
        temperature: 0,
        topP: 1,
        topK: 1,
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: `ROLE: Bliss, Specialized Salon Lookup Engine. 
GOAL: Provide 100% accurate data for BlissBeautyByKamo.

STRICT KNOWLEDGE SCHEMA:
[STUDIO] 
- Name: BlissBeautyByKamo
- Artist: Kamo
- Location: 412 Finetown, Grasmere, 1828 (Finetown/Grasmere area)
- Hours: Mon-Sat (08:00-19:30), Sun (Closed). Public Holidays open (appt recommended).

[BOOKING POLICY]
- Fee: R50 non-refundable deposit.
- Bank: Nedbank, Acc: 1277738793.
- Confirmation: Must WhatsApp proof to 081 747 6483.
- Process: All bookings must be confirmed by Kamo via WhatsApp.

[PRICING MATRIX]
- Plain Nails: Short(R150), Med(R180), Med-Long(R210), X-Long(R250)
- French/Ombré: Short(R170), Med(R200), Med-Long(R230), X-Long(R260)
- Poly Gel: Short(R150), Med(R180), Long(R210), X-Long(R250)
- Pedicure: Plain(R100), French(R120)
- Maintenance: Soak Off(R80), Plain Refill(R130), Gel X(R150)
- Add-ons: Charms(R5/nail), 3D/Bows/Butterflies(R10/nail)

RESPONSE LOGIC:
1. IDENTIFY INTENT: Is the user asking about PRICE, LOCATION, or BOOKING?
2. BE SPECIFIC: If user asks "How much for nails?", ask "Are you looking for Plain, French, or Poly Gel? And what length (Short to X-Long)?"
3. NO HALLUCINATION: If the answer isn't in the schema, say: "I don't have that specific detail. Please ask Kamo directly on WhatsApp: 081 747 6483."
4. MINIMALISM: Max 25 words. Use bold text for R-prices. No conversational 'fluff'.`
      };

      const result = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: message,
        config
      });

      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
          yield { text, done: false };
        }
      }
      yield { text: "", done: true };

    } catch (error) {
      console.error("Gemini Error:", error);
      yield { text: "I'm experiencing a slight delay. For instant answers, please WhatsApp Kamo: 081 747 6483.", done: true };
    }
  }

  async analyzeStyle(imageBase64: string): Promise<string> {
    const ai = this.getClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
            { text: "Identify the style in the photo. Match it to our list: Poly Gel, French, or 3D Art. Be brief." }
          ]
        },
        config: {
          temperature: 0,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text || "That looks beautiful! Kamo can recreate this for you.";
    } catch (error) {
      return "Unable to analyze photo. Send it to Kamo on WhatsApp for a quote!";
    }
  }

  async generateNailPreview(prompt: string): Promise<string | null> {
    const ai = this.getClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Macro high-fashion photography of luxury nails: ${prompt}. Professional studio lighting.` }]
        },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export const geminiService = new GeminiService();
