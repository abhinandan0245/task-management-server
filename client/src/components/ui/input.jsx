import { forwardRef } from "react";
import { cn } from "../../lib/cn";

const base =
  "w-max border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm leading-normal font-normal text-zinc-900 dark:text-white placeholder:text-zinc-500 disabled:opacity-70";

const sizes = {
  small: "px-2 py-1",
  regular: "p-3",
};
export const Input = forwardRef(
  (
    {
      type,
      name,
      id,
      placeholder,
      value,
      onChange,
      disabled,
      readOnly,
      required,
      onKeyDown,
      className,
      size,
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onKeyDown={onKeyDown}
        className={cn(base, sizes[size ?? "regular"], className ?? "")}
      />
    );
  }
);
