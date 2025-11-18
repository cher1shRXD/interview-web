import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "./useResultContext";

export const useInterview = () => {
  const { result, file, fileData, clear, isLoading } = useResultContext();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [leftWidth, setLeftWidth] = useState(35);
  const [isDragging, setIsDragging] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!isLoading && (!result || (!file && !fileData))) {
      navigate("/");
    }
  }, [result, file, fileData, navigate, isLoading]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newLeftWidth = (e.clientX / window.innerWidth) * 100;
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (!result) {
    return null;
  }

  const currentQuestion = result.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === result.questions.length - 1;
  const highlightedPage = currentQuestion.relatedPage;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowAnswer(false);
    }
  };

  const handleExit = () => {
    if (window.confirm("면접을 종료하고 나가시겠습니까?")) {
      clear();
      navigate("/");
    }
  };

  return {
    result,
    file,
    fileData,
    currentQuestionIndex,
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,
    highlightedPage,
    leftWidth,
    isDragging,
    showAnswer,
    setIsDragging,
    setShowAnswer,
    handleNext,
    handlePrev,
    handleExit,
  };
};
