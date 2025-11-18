import PdfViewer from "../components/PdfViewer";
import { ChevronLeft, ChevronRight, Eye, EyeOff, X, Send } from "lucide-react";
import { useInterview } from "../hooks/useInterview";
import ReactMarkdown from "react-markdown";

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
    userAnswer,
    feedback,
    isLoadingFeedback,
    showFeedbackModal,
    setIsDragging,
    setShowAnswer,
    setUserAnswer,
    setShowFeedbackModal,
    handleNext,
    handlePrev,
    handleExit,
    handleGetFeedback,
  } = interviewData;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const rightSectionStyle = isMobile ? {} : { width: `${100 - leftWidth}%` };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row relative overflow-hidden">
      <button
        onClick={handleExit}
        className="absolute top-2 right-2 md:top-4 md:right-4 z-10 flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors shadow-lg text-sm md:text-base">
        <X size={16} className="md:w-5 md:h-5" />
        <span className="hidden sm:inline">나가기</span>
      </button>

      <div
        className="hidden md:block h-full"
        style={{ width: `${leftWidth}%` }}>
        <PdfViewer file={file} fileData={fileData} highlightedPage={highlightedPage} />
      </div>

      <div
        className={`hidden md:block w-px hover:w-1 h-full bg-gray-300 hover:bg-orange-500 cursor-col-resize transition-all ${
          isDragging ? "bg-orange-500" : ""
        }`}
        onMouseDown={() => setIsDragging(true)}
      />

      <div className="h-full flex flex-col flex-1" style={rightSectionStyle}>
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-auto">
          <div className="max-w-2xl w-full space-y-4 md:space-y-6">
            <div className="flex items-center justify-between mb-4 md:mb-8">
              <span className="text-xs md:text-sm text-gray-500">
                질문 {currentQuestionIndex + 1} / {result.questions.length}
              </span>
              <div className="flex gap-1">
                {result.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
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

            <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <span className="px-2 md:px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs md:text-sm font-medium">
                  {currentQuestion.category}
                </span>
                <span
                  className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
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

              <h2 className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed break-keep">
                {currentQuestion.question}
              </h2>

              <div className="mt-4 md:mt-6">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="답변을 입력해보세요..."
                  className="w-full h-24 md:h-32 p-3 md:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
                />
                <button
                  onClick={handleGetFeedback}
                  disabled={isLoadingFeedback || !userAnswer.trim()}
                  className="mt-2 flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base">
                  <Send size={16} className="md:w-4 md:h-4" />
                  {isLoadingFeedback ? "피드백 생성 중..." : "AI 피드백 받기"}
                </button>
              </div>

              <div className="mt-3 md:mt-4">
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  {showAnswer ? (
                    <>
                      <EyeOff size={14} className="md:w-4 md:h-4" />
                      모범답안 숨기기
                    </>
                  ) : (
                    <>
                      <Eye size={14} className="md:w-4 md:h-4" />
                      모범답안 보기
                    </>
                  )}
                </button>

                {showAnswer && (
                  <div className="mt-3 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-xs md:text-sm font-semibold text-blue-900 mb-2">
                      모범답안
                    </h4>
                    <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
                      {currentQuestion.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 md:pt-4 gap-2">
              <button
                onClick={handlePrev}
                disabled={isFirstQuestion}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs md:text-base">
                <ChevronLeft size={16} className="md:w-5 md:h-5" />
                <span className="hidden sm:inline">이전 질문</span>
                <span className="sm:hidden">이전</span>
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleExit}
                  className="px-3 md:px-6 py-2 md:py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs md:text-base">
                  면접 종료
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs md:text-base">
                  <span className="hidden sm:inline">다음 질문</span>
                  <span className="sm:hidden">다음</span>
                  <ChevronRight size={16} className="md:w-5 md:h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
          <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
            포트폴리오 요약
          </h3>
          <p className="text-xs md:text-sm text-gray-600 line-clamp-3 md:line-clamp-none">{result.summary}</p>
        </div>
      </div>

      {showFeedbackModal && feedback && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4"
          onClick={() => setShowFeedbackModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">
                AI 피드백
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="prose prose-sm md:prose max-w-none">
                <ReactMarkdown
                  components={{
                    h1: (props) => <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 break-keep" {...props} />,
                    h2: (props) => <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 mt-6 break-keep" {...props} />,
                    h3: (props) => <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2 mt-4 break-keep" {...props} />,
                    p: (props) => <p className="text-sm md:text-base text-gray-700 mb-3 leading-relaxed break-keep" {...props} />,
                    strong: (props) => <strong className="font-semibold text-gray-900 break-keep" {...props} />,
                    ul: (props) => <ul className="list-disc list-inside mb-3 space-y-1 break-keep" {...props} />,
                    ol: (props) => <ol className="list-decimal list-inside mb-3 space-y-1 break-keep" {...props} />,
                    li: (props) => <li className="text-sm md:text-base text-gray-700 break-keep" {...props} />,
                  }}
                >
                  {feedback}
                </ReactMarkdown>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 md:p-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;