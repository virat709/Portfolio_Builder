
import { GoogleGenAI, Type } from "@google/genai";
import { PortfolioData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const portfolioSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    title: { type: Type.STRING },
    tagline: { type: Type.STRING },
    about: { type: Type.STRING },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    experiences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          duration: { type: Type.STRING },
          description: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["company", "role", "duration", "description"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          year: { type: Type.STRING }
        },
        required: ["institution", "degree", "year"]
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description", "technologies"]
      }
    },
    contact: {
      type: Type.OBJECT,
      properties: {
        email: { type: Type.STRING },
        location: { type: Type.STRING },
        socials: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              url: { type: Type.STRING }
            }
          }
        }
      }
    }
  },
  required: ["name", "title", "tagline", "about", "skills", "experiences", "education", "projects", "contact"]
};

const SUPPORTED_MIMES = ['application/pdf', 'text/plain', 'text/markdown'];

export async function generatePortfolioFromResume(file: File): Promise<PortfolioData> {
  let mimeType = file.type;
  
  if (!mimeType) {
    if (file.name.endsWith('.pdf')) mimeType = 'application/pdf';
    else if (file.name.endsWith('.txt')) mimeType = 'text/plain';
    else if (file.name.endsWith('.md')) mimeType = 'text/markdown';
  }

  if (!SUPPORTED_MIMES.includes(mimeType)) {
    throw new Error(`The file type "${mimeType || 'unknown'}" is not directly supported by the AI parser. Please upload a PDF or Text file.`);
  }

  const base64Data = await fileToBase64(file);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: "Extract information from this resume and format it into a professional portfolio structure. IMPORTANT: Include 1-2 professional emojis in the 'tagline' and 'about' sections (e.g., 🚀, 💻, ✨) to make it more engaging. Categorize skills properly. If social links are missing, provide placeholders for LinkedIn, GitHub, and X (Twitter) based on the user's name."
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: portfolioSchema
    }
  });

  if (!response.text) {
    throw new Error("Failed to parse resume content");
  }

  return JSON.parse(response.text) as PortfolioData;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}
