
import { GoogleGenAI, Type } from "@google/genai";
import { AppIdea } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ideaSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      tagline: { type: Type.STRING },
      problem: { type: Type.STRING },
      solution: { type: Type.STRING },
      executiveSummary: { 
        type: Type.STRING,
        description: "A professional, high-level abstract of the system's core value proposition."
      },
      helperPrompts: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Exactly 5 advanced engineering prompts for technical implementation."
      },
      coreFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
      techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
      userJourney: { type: Type.ARRAY, items: { type: Type.STRING } },
      dataFlow: { type: Type.ARRAY, items: { type: Type.STRING } },
      monetizationStrategy: { 
        type: Type.STRING,
        description: "A detailed professional analysis of the business model and revenue streams."
      },
      relevantFacts: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of 3-5 technical, architectural, or market facts relevant to this app."
      },
      targetAudience: { type: Type.STRING },
      monetization: { type: Type.STRING },
      aiImplementation: {
        type: Type.OBJECT,
        properties: {
          useCase: { type: Type.STRING },
          modelSuggestion: { type: Type.STRING },
          whyThisModel: { type: Type.STRING }
        },
        required: ['useCase', 'modelSuggestion', 'whyThisModel']
      },
      complexity: { type: Type.STRING }
    },
    required: [
      'id', 'title', 'tagline', 'problem', 'solution', 
      'executiveSummary', 'helperPrompts', 'coreFeatures',
      'techStack', 'userJourney', 'dataFlow', 'monetizationStrategy',
      'relevantFacts', 'targetAudience', 'monetization', 
      'aiImplementation', 'complexity'
    ]
  }
};

export async function brainstormIdeas(prompt: string): Promise<AppIdea[]> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are a Lead Solutions Architect and Venture Capital Strategist.
    Generate 3 high-fidelity, enterprise-ready AI application architectures.
    
    TONE & CONTENT:
    1. 'executiveSummary': Provide a precise, professional abstract of the product logic.
    2. 'helperPrompts': Generate exactly 5 sophisticated technical prompts. These must be senior-level (e.g., "Design a distributed consensus mechanism for...", "Implement a multi-tenant vector isolation strategy in PostgreSQL...", "Draft a CI/CD pipeline for fine-tuning cycles...").
    3. 'monetizationStrategy': Outline a robust B2B or B2C revenue model, including pricing tiers or API unit economics.
    4. 'relevantFacts': Include specific, empirically-grounded technical or market data (e.g., "Vector DB latency averages <50ms with HNSW indexing", "Market CAGR for this sector is 22.5%").
    5. No mention of 'simple explanations' or child-friendly concepts.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Perform high-level architectural brainstorming for: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ideaSchema,
        temperature: 0.72,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Null response from architectural engine.");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Architecture Error:", error);
    throw error;
  }
}
