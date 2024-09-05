import { useForm } from "react-hook-form";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { useState } from "react";
import { ClipboardCheck, ClipboardList, CodeXml } from "lucide-react";
import { useToast } from "./components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ISIValuesSchema = z.object({
  padding: z.coerce
    .number({ message: "Padding needs to be a number" })
    .optional(),
  fontSize: z.coerce
    .number({ message: "Font size needs to be a number" })
    .optional(),
  fontColor: z.string().regex(/^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))$|^$/i, {
    message: "Font color needs to be a valid hex color",
  }),
  tableColor: z.string().regex(/^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))$|^$/i, {
    message: "Table color needs to be a valid hex color",
  }),
  lineHeight: z.coerce
    .number({ message: "Line height needs to be a number" })
    .optional(),
  gutterWidth: z.coerce
    .number({ message: "Gutter needs to be a number" })
    .optional(),
  ISI: z.string().min(1, { message: "ISI text is required" }),
});

type ISIValues = z.infer<typeof ISIValuesSchema>;

function App() {
  const [generatedISI, setGeneratedISI] = useState("");
  const [isClipboardWritten, setIsClipboardWritten] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISIValues>({
    resolver: zodResolver(ISIValuesSchema),
  });
  const { toast } = useToast();

  function handleISIValues({
    padding,
    fontSize,
    fontColor,
    tableColor,
    lineHeight,
    gutterWidth,
    ISI,
  }: ISIValues) {
    const generateRow = (
      text: string,
      isBold: boolean = false,
      isBullet: boolean = false,
    ) => {
      const paddingValue = padding ? padding + "px" : "10px";
      const fontSizeValue = fontSize ? fontSize + "px" : "16px";
      const fontColorValue = fontColor ? fontColor : "#000000";
      const lineHeightValue = lineHeight ? lineHeight + "px" : "16px";
      const gutterWidthValue = gutterWidth ? gutterWidth + "px" : "30px";
      const tableColorValue = tableColor ? tableColor : "#FFFFFE";

      const commonStyle = `font-family: Arial, Helvetica, sans-serif; font-size: ${fontSizeValue}; line-height: ${lineHeightValue}; color: ${fontColorValue}; padding-bottom: ${paddingValue}; font-weight: ${isBold ? "bold;" : "normal;"}`;

      if (isBullet) {
        text = `\n\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%">\n\t\t\t\t<tr>\n\t\t\t\t\t<td width="12" valign="top" align="left" style="${commonStyle} font-weight: bold;">&bull;</td>\n\t\t\t\t\t<td valign="top" align="left" style="${commonStyle}">${text}</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t`;
      }

      return `<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${tableColorValue}">\n\t<tr>\n\t\t<td width="${gutterWidthValue}" class="gutter">&nbsp;</td>\n\t\t<td align="left" style="${commonStyle}">\n\t\t\t${text}\n\t\t</td>\n\t\t<td width="${gutterWidthValue}" class="gutter">&nbsp;</td>\n\t</tr>\n</table>\n`;
    };

    const generatedISIRows = ISI.split(/\r?\n|\r/)
      .filter((row) => row.length > 0)
      .map((text) => {
        if (text.startsWith("**")) return generateRow(text.substring(2), true);
        if (text.startsWith("-"))
          return generateRow(text.substring(1), false, true);
        return generateRow(text);
      })
      .join("");

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
            ISI Generator
          </h1>

          <h3 className="mb-3 text-center font-light text-foreground">
            Below you can generate an ISI code just copying and pasting <br /> a
            normal text with break lines
          </h3>

          <div className="flex w-full flex-col justify-center gap-6 md:flex-row">
            <form
              className="gap-2 md:grid md:w-1/2 md:grid-cols-2"
              onSubmit={handleSubmit(handleISIValues)}
            >
              <div className="mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="padding">Padding between lines (px)</Label>
                <Input
                  type="text"
                  placeholder="Default: 10px"
                  id="padding"
                  {...register("padding")}
                />
                {errors.padding && (
                  <p className="text-sm font-medium text-red-500 dark:font-light">
                    {errors.padding.message}
                  </p>
                )}
              </div>

              <div className="mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="table-color">Table color (#)</Label>
                <Input
                  type="text"
                  placeholder="Default: #FFFFFE"
                  id="table-color"
                  {...register("tableColor")}
                />
                {errors.tableColor && (
                  <p className="text-sm font-medium text-red-500 dark:font-light">
                    {errors.tableColor.message}
                  </p>
                )}
              </div>

              <div className="mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="font-size">Font size (px)</Label>
                <Input
                  type="text"
                  placeholder="Default: 12px"
                  id="font-size"
                  {...register("fontSize")}
                />
                {errors.fontSize && (
                  <p className="text-sm font-medium text-red-500 dark:font-light">
                    {errors.fontSize.message}
                  </p>
                )}
              </div>

              <div className="mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="font-color">Font color (#)</Label>
                <Input
                  type="text"
                  placeholder="Default: #000000"
                  id="font-color"
                  {...register("fontColor")}
                />
                {errors.fontColor && (
                  <p className="text-sm font-medium text-red-500 dark:font-light">
                    {errors.fontColor.message}
                  </p>
                )}
              </div>

              <div className="mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="line-height">Line height (px)</Label>
                <Input
                  type="text"
                  placeholder="Default: 16px"
                  id="line-height"
                  {...register("lineHeight")}
                />
                {errors.lineHeight && (
                  <p className="text-sm font-medium text-red-500 dark:font-light">
                    {errors.lineHeight.message}
                  </p>
                )}
              </div>

              <div className="mb-3 space-y-1 md:mb-0 md:space-y-2">
                <Label htmlFor="gutter-width">Gutter width (px)</Label>
                <Input
                  type="text"
                  placeholder="Default: 30px"
                  id="gutter-width"
                  {...register("gutterWidth")}
                />
                {errors.gutterWidth && (
                  <p className="text-sm font-medium text-red-500 dark:font-light">
                    {errors.gutterWidth.message}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-1 md:space-y-2">
                <Label htmlFor="line-height">Your ISI text</Label>
                <Textarea
                  className="min-h-60 resize-none scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800"
                  {...register("ISI")}
                />
                {errors.ISI && (
                  <p className="text-sm font-medium text-red-500 dark:font-light">
                    {errors.ISI.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="col-span-2 mt-2 w-full"
                variant="secondary"
              >
                <CodeXml className="mr-2" />
                Generate your HTML code
              </Button>
            </form>

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
