import { useState } from "react";
import Header from "./components/Header";
import { useTheme } from "./components/theme-provider";

function App() {
  const { setTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<"play" | "stake" | "create">(
    "play"
  );
  setTheme("dark");

  return (
    <div className="container m-auto max-w-5xl mt-[10px] border border-border">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {/* Content Section based on currentPage */}
      <div className="p-4">
        {currentPage === "play" && <div>Play Page</div>}
        {currentPage === "stake" && <div>Stake Page</div>}
        {currentPage === "create" && <div>Create Page</div>}
      </div>
    </div>
  );
}

export default App;
