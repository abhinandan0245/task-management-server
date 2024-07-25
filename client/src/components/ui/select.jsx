import { createContext, useContext, useRef, useState, useEffect } from "react";
import { cn } from "../../lib/cn";
import { Button } from "./button";
import { ChevronDownIcon } from "lucide-react";

const base = "w-max relative";
const baseT = "w-full justify-between font-normal";
const baseC =
  "absolute top-[110%] left-0 z-20 min-w-full w-max rounded-md bg-white border border-zinc-200 p-1 scale-y-0 transition-transform origin-top";
const baseCW = "w-full flex flex-col gap-1";
const baseI = "w-full";

const SelectContext = createContext(undefined);

const useSelectContext = () => {
  const context = useContext(SelectContext);

  return context;
};

const Select = ({ children, value, onChange, name, className }) => {
  const [defaultValue, setDefaultValue] = useState(value ?? "");
  const [isShow, setIsShow] = useState(false);

  return (
    <SelectContext.Provider
      value={{
        defaultValue,
        setDefaultValue,
        onChange,
        name,
        isShow,
        setIsShow,
      }}
    >
      <div className={cn(base, className ?? "")}>{children}</div>
    </SelectContext.Provider>
  );
};
const SelectTrigger = ({ children, className }) => {
  const { defaultValue, setIsShow } = useSelectContext();

  const handleSetIsShow = () => setIsShow((prev) => !prev);

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(baseT, className ?? "")}
      onClick={handleSetIsShow}
    >
      {defaultValue.trim() === "" ? children : defaultValue}
      <ChevronDownIcon className="w-4 h-4 ms-2" />
    </Button>
  );
};
const SelectContent = ({ children, className }) => {
  const { isShow, setIsShow } = useSelectContext();

  const ref = useRef();

  useEffect(() => {
    if (ref) {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsShow(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  return (
    <div ref={ref} className={cn(baseC, isShow ? "scale-y-100" : "")}>
      <ul className={cn(baseCW, className)}>{children}</ul>
    </div>
  );
};

const SelectItem = ({ children }) => {
  const { defaultValue, setDefaultValue, onChange, name, setIsShow } =
    useSelectContext();

  const handleOnItemSelect = () => {
    onChange && onChange({ name, value: children });
    setDefaultValue(children);
    setIsShow(false);
  };

  return (
    <li className={baseI}>
      <Button
        type="button"
        variant={defaultValue === children ? "secondary" : "ghost"}
        onClick={handleOnItemSelect}
        className={baseI}
      >
        {children}
      </Button>
    </li>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem };
