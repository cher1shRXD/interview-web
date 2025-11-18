import { createContext } from "react";
import type { AnalysisResult } from "../types";

export interface ResultContextType {
  result: AnalysisResult | null;
  file: File | null;
  fileData: string | null;
  fileName: string | null;
  setResult: (result: AnalysisResult | null) => Promise<void>;
  setFile: (file: File | null) => Promise<void>;
  clear: () => Promise<void>;
  isLoading: boolean;
}

export const ResultContext = createContext<ResultContextType | null>(null);
