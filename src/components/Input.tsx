import { ArrowRight, Upload } from "lucide-react";
import { useRef, useState } from "react";

const Input = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFile, setHasFile] = useState(false);

  const handleFileChange = () => {
    const files = inputRef.current?.files;
    setHasFile(!!files && files.length > 0);
  };

  return (
    <div className="w-140 p-2 bg-container border border-border rounded-2xl space-y-3">
      <input
        type="text"
        placeholder="질문이 많이 나왔으면 하는 부분, 난이도 조절 등 추가 요구사항을 입력해주세요."
        className="w-full outline-none text-text p-2"
      />
      <div className="w-full rounded-lg shadow-lg border border-border flex items-center gap-2">
        <button
          className="p-2 pl-4 cursor-pointer text-text"
          onClick={() => inputRef.current?.click()}>
          <Upload />
        </button>
        <input
          type="file"
          className="text-gray-400 flex-1"
          accept=".pdf"
          ref={inputRef}
          onChange={handleFileChange}
        />
        <button
          className="text-white bg-orange-600 border border-orange-600 p-2 px-6 cursor-pointer rounded-lg active:scale-95 transition-transform disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
          disabled={!hasFile}>
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Input;
