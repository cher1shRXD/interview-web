import { ArrowRight, Upload, Loader2 } from "lucide-react";
import { useInput } from "../hooks/useInput";

const Input = () => {
  const {
    additionalRequirements,
    setAdditionalRequirements,
    isLoading,
    inputRef,
    handleFileChange,
    hasFile,
    fileName,
    handleSubmit,
    error,
  } = useInput();

  return (
    <div className="w-full max-w-xl md:max-w-2xl space-y-4">
      <div className="p-3 md:p-2 bg-container border border-border rounded-2xl space-y-3">
        <input
          type="text"
          placeholder="추가 요구사항 (선택)"
          className="w-full outline-none text-text p-2 text-sm md:text-base placeholder:text-sm md:placeholder:text-base"
          value={additionalRequirements}
          onChange={(e) => setAdditionalRequirements(e.target.value)}
          disabled={isLoading}
        />
        <div className="w-full rounded-lg shadow-lg border border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            className="p-3 sm:p-2 sm:pl-4 cursor-pointer text-text disabled:cursor-not-allowed flex items-center justify-center sm:justify-start gap-2 sm:gap-0"
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}>
            <Upload className="w-5 h-5" />
            <span className="sm:hidden text-sm">파일 선택</span>
          </button>
          <input
            type="file"
            className="hidden sm:block text-gray-400 flex-1 text-sm"
            accept=".pdf"
            ref={inputRef}
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <div className="sm:hidden px-3 text-sm text-gray-500 text-center">
            {fileName || "파일을 선택하세요"}
          </div>
          <button
            className="text-white bg-orange-600 border border-orange-600 p-3 sm:p-2 sm:px-6 cursor-pointer rounded-lg sm:rounded-r-lg sm:rounded-l-none active:scale-95 transition-transform disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={!hasFile || isLoading}
            onClick={handleSubmit}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span className="text-sm md:text-base">분석중...</span>
              </>
            ) : (
              <>
                <span className="sm:hidden text-sm">분석 시작</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm md:text-base">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
