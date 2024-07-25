import { forwardRef } from "react";
import { cn } from "../../lib/cn";

const base =
  "p-3 w-max border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm leading-normal font-normal text-zinc-900 dark:text-white placeholder:text-zinc-500 disabled:opacity-70";

export const Textarea = forwardRef(
  (
    {
      rows,
      cols,
      name,
      id,
      placeholder,
      value,
      onChange,
      disabled,
      readOnly,
      required,
      className,
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        cols={cols}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={cn(base, className ?? "")}
      />
    );
  }
);
