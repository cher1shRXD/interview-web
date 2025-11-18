export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  relatedPage: number;
  answer: string;
}

export interface AnalysisResult {
  questions: InterviewQuestion[];
  summary: string;
}

export interface AnalyzePortfolioRequest {
  file: File;
  additionalRequirements?: string;
}
