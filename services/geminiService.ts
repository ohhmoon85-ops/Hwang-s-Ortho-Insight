import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PatientData } from "../types";

// [중요] 키 가져오는 방식 수정 (Vite 방식)
const API_KEY = import.meta.env.VITE_API_KEY;

// Define the response schema strictly to ensure consistent JSON output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    differentialDiagnoses: {
      type: Type.ARRAY,
      description: "List of top 3 differential diagnoses.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Name of the disease (Korean/English mixed is okay)."
          },
          probability: {
            type: Type.NUMBER,
            description: "Estimated probability percentage (0-100)."
          },
          rationale: {
            type: Type.STRING,
            description: "One line medical rationale for this diagnosis."
          }
        },
        required: ["name", "probability", "rationale"]
      }
    },
    criticalCheckpoints: {
      type: Type.ARRAY,
      description: "3-4 key questions or physical exam points to verify immediately.",
      items: { type: Type.STRING }
    },
    redFlags: {
      type: Type.ARRAY,
      description: "Any urgent or dangerous conditions to rule out.",
      items: { type: Type.STRING }
    },
    recommendedWorkup: {
      type: Type.ARRAY,
      description: "Recommended imaging (X-ray views, MRI) or labs.",
      items: { type: Type.STRING }
    }
  },
  required: ["differentialDiagnoses", "criticalCheckpoints", "redFlags", "recommendedWorkup"]
};

export const generateOrthopedicInsight = async (patientData: PatientData): Promise<any> => {
  try {
    // [수정됨] 위에서 정의한 API_KEY를 사용
    if (!API_KEY) {
        throw new Error("API Key is missing in service call");
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
      model: 'gemini-2.0-flash', // 모델명을 최신 버전으로 안전하게 지정
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Orthopedic AI Assistant. Your goal is to provide high-level 'Second Opinion' differential diagnoses. Be concise, professional, and clinically accurate. Highlight red flags immediately.",
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.3, 
      }
    });

    const text = response.text(); // [참고] SDK 버전에 따라 text() 함수일 수 있음
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
