import { useState } from "react";
import Header from "./components/Header";
import { useTheme } from "./components/theme-provider";

function App() {
  const { setTheme } = useTheme();
  setTheme("dark");

  return (
    <div className="container m-auto max-w-5xl mt-[10px] border border-border">
      <Header />
      {/* Bottom / Content Section */}
      <div className="p-4">Hi!</div>
    </div>
  );
}

export default App;
