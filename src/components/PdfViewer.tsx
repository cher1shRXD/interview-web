import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { usePdfViewer } from "../hooks/usePdfViewer";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  file: File | null;
  fileData?: string | null;
  highlightedPage?: number;
}

const PdfViewer = ({ file, fileData, highlightedPage = 1 }: PdfViewerProps) => {
  const {
    numPages,
    currentPage,
    fileUrl,
    onDocumentLoadSuccess,
    onDocumentLoadError,
    handlePrevPage,
    handleNextPage,
  } = usePdfViewer({ file, fileData, highlightedPage });

  if (!file && !fileData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">PDF 파일이 없습니다.</p>
      </div>
    );
  }

  if (!fileUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">PDF를 로딩하는 중...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-orange-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed">
          이전
        </button>
        <span className="text-gray-700">
          {currentPage} / {numPages || 0}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= numPages}
          className="px-4 py-2 bg-orange-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed">
          다음
        </button>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="max-w-full">
          <Page
            pageNumber={currentPage}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
            width={600}
          />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
