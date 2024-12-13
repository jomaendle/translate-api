import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("/");

  useEffect(() => {
    navigate(activeTab);
  }, [activeTab, navigate]);

  return (
    <header className="w-full max-w-3xl mx-auto my-6 px-4 sm:px-0">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 min-h-12">
          <TabsTrigger value="/" className="min-h-10">
            Translator
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="min-h-10">
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="help" className="min-h-10">
            Help & FAQ
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
}
