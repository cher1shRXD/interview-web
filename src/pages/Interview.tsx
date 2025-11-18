import PdfViewer from "../components/PdfViewer";
import { ChevronLeft, ChevronRight, Eye, EyeOff, X } from "lucide-react";
import { useInterview } from "../hooks/useInterview";

const Interview = () => {
  const interviewData = useInterview();

  if (!interviewData) {
    return null;
  }

  const {
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
  } = interviewData;

  return (
    <div className="w-full h-screen flex relative">
      {/* 나가기 버튼 */}
      <button
        onClick={handleExit}
        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors shadow-lg">
        <X size={20} />
        나가기
      </button>

      <div
        className="h-full"
        style={{ width: `${leftWidth}%` }}>
        <PdfViewer file={file} fileData={fileData} highlightedPage={highlightedPage} />
      </div>

      <div
        className={`w-px hover:w-1 h-full bg-gray-300 hover:bg-orange-500 cursor-col-resize transition-all ${
          isDragging ? "bg-orange-500" : ""
        }`}
        onMouseDown={() => setIsDragging(true)}
      />

      <div
        className="h-full flex flex-col"
        style={{ width: `${100 - leftWidth}%` }}>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-2xl w-full space-y-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm text-gray-500">
                질문 {currentQuestionIndex + 1} / {result.questions.length}
              </span>
              <div className="flex gap-1">
                {result.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentQuestionIndex
                        ? "bg-orange-600"
                        : index < currentQuestionIndex
                        ? "bg-orange-300"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                  {currentQuestion.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentQuestion.difficulty === "easy"
                      ? "bg-green-100 text-green-700"
                      : currentQuestion.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                  {currentQuestion.difficulty === "easy"
                    ? "쉬움"
                    : currentQuestion.difficulty === "medium"
                    ? "보통"
                    : "어려움"}
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
                {currentQuestion.question}
              </h2>

              <div className="mt-6">
                <textarea
                  placeholder="답변을 준비해보세요... (선택사항)"
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* 모범답안 섹션 */}
              <div className="mt-4">
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  {showAnswer ? (
                    <>
                      <EyeOff size={16} />
                      모범답안 숨기기
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      모범답안 보기
                    </>
                  )}
                </button>

                {showAnswer && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                      모범답안
                    </h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {currentQuestion.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handlePrev}
                disabled={isFirstQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors">
                <ChevronLeft size={20} />
                이전 질문
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleExit}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  면접 종료
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  다음 질문
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            포트폴리오 요약
          </h3>
          <p className="text-sm text-gray-600">{result.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default Interview;