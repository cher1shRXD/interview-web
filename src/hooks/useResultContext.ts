import { useContext } from "react";
import { ResultContext } from "../contexts/ResultContextDefinition";

export const useResultContext = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResultContext must be used within ResultProvider");
  }
  return context;
};
