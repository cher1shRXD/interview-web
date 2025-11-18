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
    handleSubmit,
    error,
  } = useInput();

  return (
    <div className="w-140 space-y-4">
      <div className="p-2 bg-container border border-border rounded-2xl space-y-3">
        <input
          type="text"
          placeholder="질문이 많이 나왔으면 하는 부분, 난이도 조절 등 추가 요구사항을 입력해주세요."
          className="w-full outline-none text-text p-2"
          value={additionalRequirements}
          onChange={(e) => setAdditionalRequirements(e.target.value)}
          disabled={isLoading}
        />
        <div className="w-full rounded-lg shadow-lg border border-border flex items-center gap-2">
          <button
            className="p-2 pl-4 cursor-pointer text-text disabled:cursor-not-allowed"
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}>
            <Upload />
          </button>
          <input
            type="file"
            className="text-gray-400 flex-1"
            accept=".pdf"
            ref={inputRef}
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <button
            className="text-white bg-orange-600 border border-orange-600 p-2 px-6 cursor-pointer rounded-lg active:scale-95 transition-transform disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={!hasFile || isLoading}
            onClick={handleSubmit}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                분석중...
              </>
            ) : (
              <ArrowRight />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
