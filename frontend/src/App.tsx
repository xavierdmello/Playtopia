import { useState } from "react";
import Header from "./components/Header";
import { useTheme } from "./components/theme-provider";

function App() {
  const { setTheme } = useTheme();
  setTheme("dark");

  return (
    <div className="container m-auto max-w-5xl mt-0 pt-0">
      <Header />
      Hello!
    </div>
  );
}

export default App;
