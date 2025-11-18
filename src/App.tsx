import Router from "./router";
import { ResultProvider } from "./contexts/ResultContext";

const App = () => {
  return (
    <ResultProvider>
      <Router />
    </ResultProvider>
  );
};

export default App;