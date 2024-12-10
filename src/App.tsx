import "./App.css";
import { Translator } from "@/components/Translator/Translator.tsx";
import { GitHubLink } from "@/components/GitHubLink/GitHubLink.tsx";
import { TranslationApiNotEnabled } from "@/components/TranslationApiNotEnabled/TranslationApiNotEnabled.tsx";

function App() {
  return (
    <>
      <TranslationApiNotEnabled />

      <div className="container mx-auto flex flex-1 justify-center p-4">
        {/*<h1 className="text-3xl font-bold text-center mb-6">
          Language Learning App
        </h1>*/}
        {/* <Tabs defaultValue="translator" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="translator">Translator</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          </TabsList>
          <TabsContent value="translator">
            <Translator />
          </TabsContent>
          <TabsContent value="flashcards">
            <Flashcards />
          </TabsContent>
        </Tabs>*/}

        <Translator />
      </div>

      <GitHubLink />
    </>
  );
}

export default App;
