import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { useState } from "react";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import { useToast } from "./components/ui/use-toast";
import ISIForm from "./components/isi-form";

function App() {
  const [generatedISI, setGeneratedISI] = useState("");
  const [isClipboardWritten, setIsClipboardWritten] = useState(false);

  const { toast } = useToast();

  function copyTextToClipboard() {
    navigator.clipboard
      .writeText(generatedISI)
      .then(() => {
        toast({
          description: "Your ISI was copied to your clipboard.",
        });
        setIsClipboardWritten(true);
      })
      .catch(() => {
        toast({
          description: "It wasn't possible to copy your ISI.",
        });
      });
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="fixed right-2 top-2">
          <ModeToggle />
        </div>

        <div className="container flex flex-col items-center justify-center px-4 py-8">
          <h1 className="mb-4 text-center text-2xl font-bold lg:text-4xl">
            ISI Generator
          </h1>

          <h3 className="mb-3 text-center font-light text-foreground">
            Below you can generate an ISI code just copying and pasting <br /> a
            normal text with break lines
          </h3>

          <div className="flex w-full flex-col justify-center gap-6 md:flex-row">
            <ISIForm
              setGeneratedISI={setGeneratedISI}
              setIsClipboardWritten={setIsClipboardWritten}
            />

            {generatedISI && (
              <div className="relative flex max-h-[580px] md:w-1/2">
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute left-2 top-2"
                  onClick={copyTextToClipboard}
                  title="Copy to clipboard"
                >
                  {isClipboardWritten ? <ClipboardCheck /> : <ClipboardList />}
                </Button>
                <div className="overflow-y-auto rounded-md border-2 p-4 pt-8 scrollbar scrollbar-track-transparent scrollbar-thumb-zinc-800 md:pt-14">
                  <pre className="text-xs">{generatedISI}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
