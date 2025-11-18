import { useState, useEffect } from "react";

interface UsePdfViewerProps {
  file: File | null;
  fileData?: string | null;
  highlightedPage?: number;
}

export const usePdfViewer = ({
  file,
  fileData,
  highlightedPage = 1,
}: UsePdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fileUrl = file ? URL.createObjectURL(file) : fileData;

  useEffect(() => {
    if (highlightedPage) {
      setTimeout(() => {
        setCurrentPage(highlightedPage);
      }, 0);
    }
  }, [highlightedPage]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF 로딩 오류:", error);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

  return {
    numPages,
    currentPage,
    fileUrl,
    onDocumentLoadSuccess,
    onDocumentLoadError,
    handlePrevPage,
    handleNextPage,
  };
};
