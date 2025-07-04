import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { CodeXml } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ISIValuesSchema = z.object({
  padding: z.coerce
    .number({ message: "Padding needs to be a number" })
    .optional(),
  fontSize: z.coerce
    .number({ message: "Font size needs to be a number" })
    .optional(),
  fontColor: z
    .string()
    .regex(/^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))$|^$/i, {
      message: "Font color needs to be a valid hex color",
    })
    .optional(),
  tableColor: z
    .string()
    .regex(/^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))$|^$/i, {
      message: "Table color needs to be a valid hex color",
    })
    .optional(),
  lineHeight: z.coerce
    .number({ message: "Line height needs to be a number" })
    .optional(),
  gutterWidth: z.coerce
    .number({ message: "Gutter needs to be a number" })
    .optional(),
  ISI: z.string().min(1, { message: "ISI text is required" }),
  hasBullets: z.boolean().optional(),
  bulletColor: z
    .string()
    .regex(/^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))$|^$/i, {
      message: "Bullet color needs to be a valid hex color",
    })
    .optional(),
});

type ISIValues = z.infer<typeof ISIValuesSchema>;
type ISIFormProps = {
  setGeneratedISI: React.Dispatch<React.SetStateAction<string>>;
  setIsClipboardWritten: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ISIForm({
  setGeneratedISI,
  setIsClipboardWritten,
}: ISIFormProps) {
  const form = useForm<ISIValues>({
    resolver: zodResolver(ISIValuesSchema),
    defaultValues: {
      padding: 10,
      fontSize: 16,
      fontColor: "#000000",
      tableColor: "#FFFFFE",
      lineHeight: 16,
      gutterWidth: 30,
      ISI: "",
      hasBullets: false,
      bulletColor: "#000000",
    },
  });

  function handleISIValues({
    padding,
    fontSize,
    fontColor,
    tableColor,
    lineHeight,
    gutterWidth,
    ISI,
    bulletColor,
  }: ISIValues) {
    const generateRow = (
      text: string,
      isBold: boolean = false,
      isBullet: boolean = false,
    ) => {
      const commonStyle = `font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize}px; line-height: ${lineHeight}px; color: ${fontColor}; padding-bottom: ${padding}px; font-weight: ${isBold ? "bold;" : "normal;"}`;

      if (isBullet) {
        return (text = `\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%">\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td width="12" valign="top" align="left" style="font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize}px; line-height: ${lineHeight}px; color: ${bulletColor}; padding-bottom: ${padding}px; font-weight: bold;">&bull;</td>\n\t\t\t\t\t\t\t\t<td valign="top" align="left" style="${commonStyle}">${text}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>`);
      }

      return `\n\t\t\t\t<tr>\n\t\t\t\t\t<td align="left" style="${commonStyle}">\n\t\t\t\t\t\t${text}\n\t\t\t\t\t</td>\n\t\t\t\t</tr>`;
    };

    const generatedISIRows = ISI.split(/\r?\n|\r/)
      .filter((row) => row.length > 0)
      .map((text) => {
        if (text.startsWith("**")) return generateRow(text.substring(2), true);
        // prettier-ignore
        if (text.startsWith("-")) return generateRow(text.substring(1), false, true);
        return generateRow(text);
      })
      .join("");

    const gutterWidthValue = gutterWidth ? gutterWidth : "30px";
    const tableColorValue = tableColor ? tableColor : "#FFFFFE";

    const generatedISI = `<table cellpadding="0" cellspacing="0" border="0" width="600" style="min-width: 600px;" class="wrapper" role="presentation" bgcolor="${tableColorValue}">\n\t<tr>\n\t\t<td width="${gutterWidthValue}" class="gutter">&nbsp;</td>\n\t\t<td>\n\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%">${generatedISIRows}\n\t\t\t</table>\n\t\t</td>\n\t\t<td width="${gutterWidthValue}" class="gutter">&nbsp;</td>\n\t</tr>\n</table>`;

    setIsClipboardWritten(false);
    setGeneratedISI(generatedISI);
  }
  return (
    <Form {...form}>
      <form
        className="space-y-3 md:grid md:w-1/2 md:grid-cols-2 md:gap-3 md:space-y-0"
        onSubmit={form.handleSubmit(handleISIValues)}
      >
        <FormField
          control={form.control}
          name="padding"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="padding">
                Padding between lines (px)
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: 10px"
                  id="padding"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tableColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="table-color">Table color (#)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: #FFFFFE"
                  id="table-color"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="font-size">Font size (px)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: 12px"
                  id="font-size"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fontColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="font-color">Font color (#)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: #000000"
                  id="font-color"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lineHeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="line-height">Line height (px)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: 16px"
                  id="line-height"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gutterWidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="gutter-width">Gutter width (px)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: 30px"
                  id="gutter-width"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasBullets"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="hasBullets"
                />
              </FormControl>
              <FormLabel className="!mt-0" htmlFor="hasBullets">
                Change ISI bullets color
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bulletColor"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel
                htmlFor="bullet-color"
                className={`${!form.getValues("hasBullets") ? "text-zinc-800" : "text-white"}`}
              >
                Bullet color (#)
              </FormLabel> */}
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: #000000"
                  id="bullet-color"
                  disabled={!form.getValues("hasBullets")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ISI"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor="ISI">Your ISI text</FormLabel>
              <Tooltip>
                <TooltipTrigger asChild className="inline-block ml-1 text-slate-600 cursor-pointer">
                  <p>(?)</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="mb-2">Insert the following symbols to format your text:</p>
                  <p><strong>**</strong> Bold text</p>
                  <p><strong>&ndash;</strong> Bullet point</p>
                </TooltipContent>
              </Tooltip>
              <FormControl>
                <Textarea
                  className="min-h-60 resize-none scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="col-span-2 mt-2 w-full"
          variant="secondary"
        >
          <CodeXml className="mr-2" />
          Generate your HTML code
        </Button>
      </form>
    </Form>
  );
}
