import { createContext, useContext, useEffect, useRef } from "react";
import { cn } from "../../lib/cn";

const PopoverContext = createContext(undefined);

const usePopoverContext = useContext(PopoverContext);

const Popover = ({ children, isOpen, handler }) => {
  return (
    <PopoverContext.Provider value={{ isOpen, handler }}>
      <div>{children}</div>
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = ({ children }) => {
  const { isOpen, handler } = usePopoverContext();

  const handleOnButtonClick = () => handler(isOpen);

  return (
    <button type="button" onClick={handleOnButtonClick}>
      {children}
    </button>
  );
};
const PopoverContent = ({ children }) => {
  const { isOpen, handler } = usePopoverContext();

  const ref = useRef();

  useEffect(() => {
    if (ref) {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          handler(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  return (
    <div ref={ref} className={cn(isOpen ? "scale-y-100" : "")}>
      {children}
    </div>
  );
};
