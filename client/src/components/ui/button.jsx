import { cn } from "../../lib/cn";

const base =
  "border rounded-md text-sm leading-none font-medium inline-flex items-center transition-colors duration-200 disabled:pointer-events-none disabled:opacity-70";

const variants = {
  primary:
    "border-zinc-900 lg:hover:border-zinc-800 dark:border-white dark:lg:hover:border-white/70 bg-zinc-900 lg:hover:bg-zinc-800 dark:bg-white dark:lg:hover:bg-white/70 text-white dark:text-zinc-900 font-normal dark:font-medium",
  secondary:
    "border-zinc-100 lg:hover:border-zinc-200 dark:border-zinc-800 dark:lg:hover:border-zinc-700 bg-zinc-100 lg:hover:bg-zinc-200 dark:bg-zinc-800 dark:lg:hover:bg-zinc-700 dark:font-normal",
  outline:
    "border-zinc-200 dark:border-zinc-700 bg-transparent lg:hover:bg-zinc-100 dark:lg:hover:bg-zinc-800 dark:font-normal",
  ghost:
    "border-transparent lg:hover:border-zinc-100 dark:lg:hover:border-zinc-800 bg-transparent lg:hover:bg-zinc-100 dark:lg:hover:bg-zinc-800 dark:font-normal",
};

const sizes = {
  regular: "h-8 w-max px-2",
  large: "h-10 w-max px-4",
  icon: "h-8 w-8 p-1 justify-center",
};

const buttonVariants = (variant = "primary", size = "regular") =>
  cn(base, variants[variant], sizes[size]);

const Button = ({
  children,
  type,
  onClick,
  disabled,
  variant,
  size,
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(buttonVariants(variant, size), className ?? "")}
    >
      {children}
    </button>
  );
};

export { Button, buttonVariants };
