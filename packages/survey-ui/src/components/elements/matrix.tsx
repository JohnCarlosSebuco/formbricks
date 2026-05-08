import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";
import { ElementError } from "@/components/general/element-error";
import { ElementHeader } from "@/components/general/element-header";
import { Label } from "@/components/general/label";
import { RadioGroupItem } from "@/components/general/radio-group";
import { cn } from "@/lib/utils";

export interface MatrixOption {
  id: string;
  label: string;
  description?: string;
}

interface MatrixProps {
  elementId: string;
  headline: string;
  description?: string;
  inputId: string;
  rows: MatrixOption[];
  columns: MatrixOption[];
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  required?: boolean;
  requiredLabel?: string;
  errorMessage?: string;
  dir?: "ltr" | "rtl" | "auto";
  disabled?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  displayMode?: "table" | "card";
  hasRemarks?: boolean;
  remarks?: Record<string, string>;
  onRemarkChange?: (rowId: string, text: string) => void;
}

function getAbbreviation(label: string): string {
  return label
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => w[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

interface CardRowProps {
  row: MatrixOption;
  columns: MatrixOption[];
  selectedColumnId?: string;
  onValueChange: (rowId: string, columnId: string) => void;
  disabled?: boolean;
  hasRemarks?: boolean;
  remark?: string;
  onRemarkChange?: (rowId: string, text: string) => void;
  inputId: string;
}

function CardRow({
  row,
  columns,
  selectedColumnId,
  onValueChange,
  disabled,
  hasRemarks,
  remark,
  onRemarkChange,
  inputId,
}: Readonly<CardRowProps>): React.JSX.Element {
  const [showRemark, setShowRemark] = React.useState(false);
  const abbr = getAbbreviation(row.label);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
          {abbr}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-slate-800">{row.label}</div>
          {row.description && <div className="text-sm text-slate-500">{row.description}</div>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {columns.map((column) => (
            <button
              key={column.id}
              type="button"
              disabled={disabled}
              onClick={() => onValueChange(row.id, column.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                selectedColumnId === column.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
              aria-pressed={selectedColumnId === column.id}
              id={`${inputId}-${row.id}-${column.id}`}>
              {column.label}
            </button>
          ))}
          {hasRemarks && (
            <button
              type="button"
              onClick={() => setShowRemark((prev) => !prev)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-slate-500 transition-colors",
                showRemark
                  ? "border-slate-300 bg-slate-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
              Add Remarks
              <svg
                className={cn("h-3.5 w-3.5 transition-transform", showRemark && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {hasRemarks && showRemark && (
        <div className="mt-3">
          <textarea
            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
            placeholder="Add your remarks here..."
            value={remark ?? ""}
            onChange={(e) => onRemarkChange?.(row.id, (e.target as HTMLTextAreaElement).value)}
            rows={2}
          />
        </div>
      )}
    </div>
  );
}

function Matrix({
  elementId,
  headline,
  description,
  inputId,
  rows,
  columns,
  value = {},
  onChange,
  required = false,
  requiredLabel,
  errorMessage,
  dir = "auto",
  disabled = false,
  imageUrl,
  videoUrl,
  displayMode = "table",
  hasRemarks = false,
  remarks = {},
  onRemarkChange,
}: Readonly<MatrixProps>): React.JSX.Element {
  const selectedValues = value;

  const handleRowChange = (rowId: string, columnId: string): void => {
    if (selectedValues[rowId] === columnId) {
      const { [rowId]: _, ...rest } = selectedValues;
      onChange(rest);
    } else {
      onChange({ ...selectedValues, [rowId]: columnId });
    }
  };

  return (
    <div className="w-full space-y-4" id={elementId} dir={dir}>
      <ElementHeader
        headline={headline}
        description={description}
        required={required}
        requiredLabel={requiredLabel}
        htmlFor={inputId}
        imageUrl={imageUrl}
        videoUrl={videoUrl}
      />
      <div className="relative" data-element-input>
        <ElementError errorMessage={errorMessage} dir={dir} />

        {displayMode === "card" ? (
          <div className="flex flex-col gap-3">
            {rows.map((row) => (
              <CardRow
                key={row.id}
                row={row}
                columns={columns}
                selectedColumnId={selectedValues[row.id]}
                onValueChange={handleRowChange}
                disabled={disabled}
                hasRemarks={hasRemarks}
                remark={remarks[row.id]}
                onRemarkChange={onRemarkChange}
                inputId={inputId}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-start" />
                  {columns.map((column) => (
                    <th key={column.id} className="p-2 text-center font-normal">
                      <Label className="justify-center">{column.label}</Label>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const rowGroupId = `${inputId}-row-${row.id}`;
                  const selectedColumnId = selectedValues[row.id];
                  const baseBgColor = index % 2 === 0 ? "bg-input-bg" : "bg-transparent";
                  return (
                    <RadioGroupPrimitive.Root
                      key={row.id}
                      asChild
                      value={selectedColumnId}
                      onValueChange={(newColumnId) => handleRowChange(row.id, newColumnId)}
                      name={rowGroupId}
                      disabled={disabled}
                      aria-required={required}
                      aria-invalid={Boolean(errorMessage)}>
                      <tr className={cn("relative", baseBgColor)} dir={dir}>
                        <th scope="row" className={cn("rounded-s-input p-2 align-middle")}>
                          <div className="flex flex-col gap-0 leading-none">
                            <Label>{row.label}</Label>
                          </div>
                        </th>
                        {columns.map((column, colIndex) => {
                          const cellId = `${rowGroupId}-${column.id}`;
                          const isLastColumn = colIndex === columns.length - 1;
                          return (
                            <td
                              key={column.id}
                              className={cn(
                                "p-2 text-center align-middle",
                                isLastColumn && "rounded-e-input"
                              )}>
                              <Label htmlFor={cellId} className="flex cursor-pointer justify-center">
                                <RadioGroupItem
                                  value={column.id}
                                  id={cellId}
                                  disabled={disabled}
                                  aria-label={`${row.label}-${column.label}`}
                                />
                              </Label>
                            </td>
                          );
                        })}
                      </tr>
                    </RadioGroupPrimitive.Root>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export { Matrix };
export type { MatrixProps };
