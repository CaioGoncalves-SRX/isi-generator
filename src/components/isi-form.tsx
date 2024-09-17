import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { CodeXml } from "lucide-react";
import { Button } from "./ui/button";

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
type ISIFormProps = {
  setGeneratedISI: React.Dispatch<React.SetStateAction<string>>;
  setIsClipboardWritten: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ISIForm({
  setGeneratedISI,
  setIsClipboardWritten,
}: ISIFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISIValues>({
    resolver: zodResolver(ISIValuesSchema),
  });

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

      const commonStyle = `font-family: Arial, Helvetica, sans-serif; font-size: ${fontSizeValue}; line-height: ${lineHeightValue}; color: ${fontColorValue}; padding-bottom: ${paddingValue}; font-weight: ${isBold ? "bold;" : "normal;"}`;

      if (isBullet) {
        return (text = `\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%">\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td width="12" valign="top" align="left" style="${commonStyle} font-weight: bold;">&bull;</td>\n\t\t\t\t\t\t\t\t<td valign="top" align="left" style="${commonStyle}">${text}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>`);
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

    const gutterWidthValue = gutterWidth ? gutterWidth + "px" : "30px";
    const tableColorValue = tableColor ? tableColor : "#FFFFFE";

    const generatedISI = `<table cellpadding="0" cellspacing="0" border="0" width="600" style="min-width: 600px;" class="wrapper" role="presentation" bgcolor="${tableColorValue}">\n\t<tr>\n\t\t<td width="${gutterWidthValue}" class="gutter">&nbsp;</td>\n\t\t<td>\n\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%">${generatedISIRows}\n\t\t\t</table>\n\t\t</td>\n\t\t<td width="${gutterWidthValue}" class="gutter">&nbsp;</td>\n\t</tr>\n</table>`;

    setIsClipboardWritten(false);
    setGeneratedISI(generatedISI);
  }
  return (
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
  );
}
