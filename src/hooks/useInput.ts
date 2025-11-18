import { useRef, useState } from "react";
import { useResultContext } from "./useResultContext";
import { useNavigate } from "react-router-dom";
import { analyzePortfolio } from "../services/gemini";

export const useInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setResult, setFile } = useResultContext();
  const navigate = useNavigate();

  const handleFileChange = () => {
    const files = inputRef.current?.files;
    const hasFiles = !!files && files.length > 0;
    setHasFile(hasFiles);
    setFileName(hasFiles ? files[0].name : "");
    setError(null);
  };

  const handleSubmit = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("파일을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzePortfolio({
        file,
        additionalRequirements: additionalRequirements.trim() || undefined,
      });

      setResult(analysisResult);
      setFile(file);
      navigate("/interview");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "분석 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    additionalRequirements,
    setAdditionalRequirements,
    isLoading,
    inputRef,
    handleFileChange,
    hasFile,
    fileName,
    handleSubmit,
    error,
  };
};
