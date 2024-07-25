import { cn } from "../../lib/cn";

const base =
  "w-max h-max p-6 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800/30 text-zinc-900 dark:text-white";
const baseH = "w-full mb-4";
const baseT = "text-xl leading-normal font-semibold dark:font-medium";
const baseD = "text-sm leading-normal font-normal text-zinc-500";
const baseB = "w-full mb-4";
const baseF = "w-full flex items-center";

const Card = ({ children, className }) => {
  return <div className={cn(base, className ?? "")}>{children}</div>;
};

const CardHeader = ({ children, className }) => {
  return <div className={cn(baseH, className ?? "")}>{children}</div>;
};

const CardTitle = ({ children, className }) => {
  return <h2 className={cn(baseT, className ?? "")}>{children}</h2>;
};

const CardDescription = ({ children, className }) => {
  return <p className={cn(baseD, className ?? "")}>{children}</p>;
};

const CardBody = ({ children, className }) => {
  return <div className={cn(baseB, className ?? "")}>{children}</div>;
};

const CardFooter = ({ children, className }) => {
  return <div className={cn(baseF, className ?? "")}>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter };
