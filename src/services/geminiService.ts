import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY as string;
const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface VideoConfig {
  style: string;
  environment: string;
  camera: string;
  lighting: string;
  vfx: string;
  sfx: string;
  audio: string;
  dialect: string;
}

export async function generateDirectorPrompt(
  script: string,
  charDesc: string,
  config: VideoConfig
) {
  const prompt = `
    You are an expert film director and AI video engineer. 
    Your task is to take a raw scene description and convert it into a highly detailed, professional cinematic prompt for AI video generation models (like Runway Gen-3 or Luma Dream Machine).

    USER INPUT:
    - Main Script/Scenario: "${script}"
    - Character Descriptions: "${charDesc}"
    
    SELECTED CINEMATIC PARAMETERS:
    - Style: ${config.style}
    - Environment: ${config.environment}
    - Camera Motion: ${config.camera}
    - Lighting: ${config.lighting}
    - VFX: ${config.vfx}
    - Sound SFX: ${config.sfx}
    - Audio Settings: ${config.audio}
    - Targeted Dialect/Tone: ${config.dialect}

    TASK:
    1. Create a "Cinematic Prompt": A 2-3 paragraph detailed description focusing on visuals, textures, movement, and atmospheric lighting.
    2. Add "Technical Tags": High-quality keywords (e.g., 8k, photorealistic, ray tracing).
    3. Respect the SFX and Audio settings in the description.
    4. If the dialect is Arabic/Algerian/Egyptian, ensure the "acting tone" or text in the video reflects that culture/essence.

    OUTPUT FORMAT:
    Provide the response as a clear, structured technical "Director's Cut" prompt.
    CRITICAL: The entire response MUST NOT exceed 2500 characters.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const text = result.text || "";
    const LIMIT = 2500;
    
    if (text.length > LIMIT) {
      return text.substring(0, LIMIT) + "...";
    }

    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate director's cut.");
  }
}
