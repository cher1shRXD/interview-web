import { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: File | null;
  fileData?: string | null;
  highlightedPage?: number;
}

const PdfViewer = ({ file, fileData, highlightedPage = 1 }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(highlightedPage);

  const fileUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return fileData;
  }, [file, fileData]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  useEffect(() => {
    setCurrentPage(highlightedPage);
  }, [highlightedPage]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

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
          className="px-4 py-2 bg-orange-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors">
          이전
        </button>
        <span className="text-gray-700 font-medium">
          {currentPage} / {numPages || 0}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= numPages}
          className="px-4 py-2 bg-orange-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors">
          다음
        </button>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error('PDF 로딩 오류:', error)}
          className="max-w-full">
          <Page
            pageNumber={currentPage}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
            width={Math.min(window.innerWidth * 0.35 - 48, 800)}
          />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
