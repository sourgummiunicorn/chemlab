import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askProfessorProton(question: string, context?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `You are Professor Proton, a friendly, enthusiastic, and slightly goofy chemistry professor for elementary school kids. 
        Your goal is to explain chemistry concepts in a way that is fun, easy to understand, and safe. 
        Use analogies, simple words, and lots of excitement! 
        Keep your answers short (2-3 sentences). 
        Current context: ${context || 'General chemistry lab'}.`,
      },
    });
    return response.text || "Oops! My beaker bubbled over. Can you ask that again?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Professor Proton is currently cleaning up a glitter explosion. Try again in a moment!";
  }
}
