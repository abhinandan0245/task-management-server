import { cn } from "../../lib/cn";

const base =
  "text-sm leading-normal font-semibold dark:font-normal text-zinc-900 dark:text-white inline-block mb-1";

export const Label = ({ children, htmlFor, className }) => {
  return (
    <label htmlFor={htmlFor} className={cn(base, className ?? "")}>
      {children}
    </label>
  );
};
