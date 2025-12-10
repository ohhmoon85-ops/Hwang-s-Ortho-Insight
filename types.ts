export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export enum PainDuration {
  Acute = 'Acute (< 6 weeks)',
  Subacute = 'Subacute (6-12 weeks)',
  Chronic = 'Chronic (> 12 weeks)'
}

export interface BodyPart {
  id: string;
  name: string;
  selected: boolean;
}

export interface PatientData {
  age: number;
  gender: Gender;
  symptomKeywords: string[];
  painScore: number; // VAS 0-10
  duration: PainDuration;
  history: string[];
  selectedBodyParts: string[];
  mainComplaint: string;
}

// AI Analysis Result Structure
export interface Diagnosis {
  name: string;
  probability: number; // 0-100
  rationale: string;
}

export interface AnalysisResult {
  differentialDiagnoses: Diagnosis[];
  criticalCheckpoints: string[];
  redFlags: string[];
  recommendedWorkup: string[];
}
