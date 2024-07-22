import { useForm } from "react-hook-form";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { useState } from "react";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import { useToast } from "./components/ui/use-toast";

type ISIValuesSchema = {
  padding: string;
  fontSize: string;
  fontColor: string;
  lineHeight: string;
  gutterWidth: string;
  ISI: string;
};

function App() {
  const { register, handleSubmit } = useForm<ISIValuesSchema>();
  const [generatedISI, setGeneratedISI] = useState<string>("");
  const [isClipboardWritten, setIsClipboardWritten] = useState<boolean>(false);
  const { toast } = useToast();

  function handleISIValues({
    padding,
    fontSize,
    fontColor,
    lineHeight,
    gutterWidth,
    ISI,
  }: ISIValuesSchema) {
    let generatedISIRows = "";
    const splittedISIText = ISI.split(/\r?\n|\r/);

    splittedISIText.forEach((text) => {
      generatedISIRows += `<tr>\n\t<td width="${gutterWidth ? gutterWidth : "30px"}" class="gutter">&nbsp;</td>\n\t<td align="left" style="font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize ? fontSize : "12px"}; line-height: ${lineHeight ? lineHeight : "16px"}; color: ${fontColor ? fontColor : "#000000"}; padding-bottom: ${padding ? padding : "10px"};font-weight: ${text.startsWith("**") ? "bold" : "normal"};">\n\t\t${text.startsWith("**") ? text.substring(2) : text}\n\t</td>\n\t<td width="${gutterWidth ? gutterWidth : "30px"}" class="gutter">&nbsp;</td>\n</tr>\n`;
    });

    setIsClipboardWritten(false);
    setGeneratedISI(generatedISIRows);
  }

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
            ISI HTML Generator
          </h1>

          <h3 className="mb-3 font-thin text-foreground">
            (**) - Text with font weight set as <strong>bold</strong>.
          </h3>

          <div className="flex max-w-full flex-col gap-6 md:flex-row">
            <form
              className="max-w-full gap-2 md:grid md:max-w-96 md:grid-cols-2"
              onSubmit={handleSubmit(handleISIValues)}
            >
              <div className="col-span-2 mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="padding">Padding between lines (px)</Label>
                <Input
                  type="text"
                  placeholder="Default: 10px"
                  id="padding"
                  {...register("padding")}
                />
              </div>

              <div className="mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="font-size">Font size (px)</Label>
                <Input
                  type="text"
                  placeholder="Default: 12px"
                  id="font-size"
                  {...register("fontSize")}
                />
              </div>

              <div className="mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="font-color">Font color (#)</Label>
                <Input
                  type="text"
                  placeholder="Default: #000000"
                  id="font-color"
                  {...register("fontColor")}
                />
              </div>

              <div className="mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="line-height">Line height (px)</Label>
                <Input
                  type="text"
                  placeholder="Default: 16px"
                  id="line-height"
                  {...register("lineHeight")}
                />
              </div>

              <div className="mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="gutter-width">Gutter width (px)</Label>
                <Input
                  type="text"
                  placeholder="Default: 30px"
                  id="gutter-width"
                  {...register("gutterWidth")}
                />
              </div>

              <div className="col-span-2 space-y-1 md:space-y-2">
                <Label htmlFor="line-height">Your ISI text</Label>
                <Textarea
                  className="min-h-60 resize-none scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800"
                  {...register("ISI")}
                  required
                />
              </div>

              <Button className="col-span-2 mt-3" variant="secondary">
                Generate your HTML code
              </Button>
            </form>

            {generatedISI && (
              <div className="relative max-h-[600px] flex-1 overflow-y-auto rounded-md border-2 p-4 pt-8 scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800 md:pt-6">
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute right-2 top-2"
                  onClick={copyTextToClipboard}
                  title="Copy to clipboard"
                >
                  {isClipboardWritten ? <ClipboardCheck /> : <ClipboardList />}
                </Button>
                <pre>{generatedISI}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
