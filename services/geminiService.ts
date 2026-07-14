
import { GoogleGenAI, Modality, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI | null;
  private hasApiKey: boolean;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    this.hasApiKey = !!apiKey;

    if (this.hasApiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      this.ai = null;
      console.warn('Gemini API Key not found. Running in demo mode.');
    }
  }

  private async fetchWithRetry(fn: () => Promise<any>, retries = 2): Promise<any> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && (error.status === 'INTERNAL' || error.code === 500)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.fetchWithRetry(fn, retries - 1);
      }
      throw error;
    }
  }

  async performOCR(base64Image: string, documentType: string): Promise<any> {
    if (!this.hasApiKey) {
      return this.getMockOCRResult(documentType);
    }

    return this.fetchWithRetry(async () => {
      const prompt = `
        You are an AI-powered heritage digitization and translation system.
        Task: Process this old handwritten heritage document of type: ${documentType}.
        
        Follow these steps:
        Step 1: Text Recognition - Accurately read and extract text, even if ancient/unclear.
        Step 2: Language Understanding - Identify the original language or script (e.g., Old Tamil, Sanskrit, etc.).
        Step 3: Preservation Notes - If words are unclear, mark them and suggest interpretations without guessing.
        
        Return the result in JSON format.
      `;

      const response = await this.ai!.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              extractedText: { type: Type.STRING, description: "The original text extracted from the manuscript." },
              detectedLanguage: { type: Type.STRING, description: "The identified script and language." },
              preservationNotes: { type: Type.STRING, description: "Technical notes on condition or unclear portions." }
            },
            required: ["extractedText", "detectedLanguage", "preservationNotes"]
          }
        }
      });

      try {
        return JSON.parse(response.text || "{}");
      } catch (e) {
        return {
          extractedText: response.text,
          detectedLanguage: "Unknown",
          preservationNotes: "No notes generated."
        };
      }
    });
  }

  private getMockOCRResult(documentType: string): any {
    const mockData: Record<string, any> = {
      land_doc: {
        extractedText: "पट्टा दस्तावेज\nनाम: राज कुमार\nभूमि क्षेत्र: 5 एकड़\nवर्ष: 1890",
        detectedLanguage: "Hindi (Devanagari)",
        preservationNotes: "Document is well-preserved. Some ink fading in corners."
      },
      property_record: {
        extractedText: "Property Deed\nOwner: Ramakrishnan\nLocation: Tamil Nadu\nArea: 2.5 Acres",
        detectedLanguage: "English with Tamil Script",
        preservationNotes: "Minor water damage on edges. Text remains legible."
      },
      village_account: {
        extractedText: "గ్రామ లెక్కలు\nవిలేజ్ నేమ్: శ్రీకాకుళం\nవర్ష: 1920\nభూమి నిబంధన: రస్ताలు",
        detectedLanguage: "Telugu (Pervasive)",
        preservationNotes: "Ancient manuscript. High historical significance."
      }
    };

    return mockData[documentType] || {
      extractedText: "Sample document text extracted from image",
      detectedLanguage: "Unknown Script",
      preservationNotes: "This is mock data. Please provide a valid API key for real OCR processing."
    };
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (!this.hasApiKey) {
      return this.getMockTranslation(text, targetLanguage);
    }

    return this.fetchWithRetry(async () => {
      const response = await this.ai!.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          You are a heritage translation expert. 
          Translate the following heritage text into modern ${targetLanguage}.
          Preserve the original meaning, cultural context, and historical value.
          
          Text:
          ${text}
        `,
      });
      return response.text || "Translation failed.";
    });
  }

  private getMockTranslation(text: string, targetLanguage: string): string {
    const translations: Record<string, string> = {
      English: `[Translation to English]: ${text}`,
      Hindi: `[Translation to Hindi]: ${text}`,
      Tamil: `[Translation to Tamil]: ${text}`,
      Telugu: `[Translation to Telugu]: ${text}`,
      Spanish: `[Traducción al español]: ${text}`,
      French: `[Traduction en français]: ${text}`,
    };
    return translations[targetLanguage] || `[Translation to ${targetLanguage}]: ${text}`;
  }

  async generateSpeech(text: string): Promise<ArrayBuffer> {
    if (!this.hasApiKey) {
      return this.getMockAudio();
    }

    return this.fetchWithRetry(async () => {
      const truncatedText = text.slice(0, 1000);
      const response = await this.ai!.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly: ${truncatedText}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("Audio generation failed");

      return this.decodeBase64(base64Audio);
    });
  }

  private getMockAudio(): ArrayBuffer {
    // Return a small valid WAV file header as mock audio
    const wavHeader = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00,
      0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20,
      0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00,
      0x04, 0x00, 0x10, 0x00, 0x64, 0x61, 0x74, 0x61,
    ]);
    return wavHeader.buffer;
  }

  private decodeBase64(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export const geminiService = new GeminiService();
