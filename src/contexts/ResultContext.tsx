import { useState, useEffect, type ReactNode } from "react";
import { db } from "../services/db";
import { ResultContext } from "./ResultContextDefinition";
import type { AnalysisResult } from "../types";

export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResultState] = useState<AnalysisResult | null>(null);
  const [file, setFileState] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.init();
        const savedResult = await db.getResult();
        const savedFile = await db.getFile();

        if (savedResult) {
          setResultState(savedResult);
        }

        if (savedFile) {
          setFileData(savedFile.fileData);
          setFileName(savedFile.fileName);
        }
      } catch (error) {
        console.error("Failed to load data from IndexedDB:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const setResult = async (newResult: AnalysisResult | null) => {
    setResultState(newResult);
    if (newResult) {
      await db.saveResult(newResult);
    }
  };

  const setFile = async (newFile: File | null) => {
    setFileState(newFile);
    if (newFile) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setFileData(base64);
        setFileName(newFile.name);
        await db.saveFile(base64, newFile.name);
      };
      reader.readAsDataURL(newFile);
    } else {
      setFileData(null);
      setFileName(null);
    }
  };

  const clear = async () => {
    setResultState(null);
    setFileState(null);
    setFileData(null);
    setFileName(null);
    await db.clear();
  };

  return (
    <ResultContext.Provider
      value={{
        result,
        file,
        fileData,
        fileName,
        setResult,
        setFile,
        clear,
        isLoading,
      }}>
      {children}
    </ResultContext.Provider>
  );
};
