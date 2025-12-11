import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PatientData } from "../types";

// [중요] 여기서도 Vite 방식(import.meta.env)으로 키를 가져옵니다.
const API_KEY = import.meta.env.VITE_API_KEY;

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    differentialDiagnoses: {
      type: Type.ARRAY,
      description: "List of top 3 differential diagnoses.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the disease (Korean/English mixed is okay)." },
          probability: { type: Type.NUMBER, description: "Estimated probability percentage (0-100)." },
          rationale: { type: Type.STRING, description: "One line medical rationale for this diagnosis." }
        },
        required: ["name", "probability", "rationale"]
      }
    },
    criticalCheckpoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendedWorkup: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["differentialDiagnoses", "criticalCheckpoints", "redFlags", "recommendedWorkup"]
};

export const generateOrthopedicInsight = async (patientData: PatientData): Promise<any> => {
  try {
    // [수정] 위에서 정의한 변수를 사용합니다.
    if (!API_KEY) {
        throw new Error("API Key is missing (VITE_API_KEY not found)");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `
      Patient Profile:
      - Age/Gender: ${patientData.age} / ${patientData.gender}
      - Pain Site: ${patientData.selectedBodyParts.join(', ')}
      - Duration: ${patientData.duration}
      - VAS Pain Score: ${patientData.painScore}/10
      - Symptom Keywords: ${patientData.symptomKeywords.join(', ')}
      - Medical History: ${patientData.history.join(', ')}
      - Chief Complaint Details: ${patientData.mainComplaint}

      Task:
      - As a senior orthopedic advisor for Dr. Hwang, analyze this patient data.
      - Provide a structured clinical assessment suitable for a medical professional.
      - Use standard medical terminology (English/Korean mixed).
      - Focus on biomechanics, pathology, and clinical correlation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Orthopedic AI Assistant. Your goal is to provide high-level 'Second Opinion' differential diagnoses. Be concise, professional, and clinically accurate. Highlight red flags immediately.",
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.3, 
      }
    });

    // SDK 버전에 따라 text() 함수 사용
    const text = response.text(); 
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
