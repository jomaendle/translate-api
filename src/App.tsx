import "./App.css";
import { Translator } from "@/components/Translator.tsx";
import { GitHubLink } from "@/components/GitHubLink.tsx";
import { TranslationApiNotEnabled } from "@/components/TranslationApiNotEnabled.tsx";
import { HelpFAQ } from "@/components/HelpFAQ.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "@/components/Header.tsx";

function App() {
  return (
    <BrowserRouter>
      <TranslationApiNotEnabled />

      <Header />

      <main className="container mx-auto flex justify-center p-4">
        <div className="flex items-center justify-center w-full">
          <Routes>
            <Route path="/" element={<Translator />} />
            {/*<Route path="flashcards" element={<Flashcards />} />*/}
            <Route path="help" element={<HelpFAQ />} />
          </Routes>
        </div>
      </main>

      <footer className="flex-1 h-full flex items-end justify-center">
        <GitHubLink />
      </footer>
    </BrowserRouter>
  );
}

export default App;
