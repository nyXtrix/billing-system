import React, { forwardRef, useState, useRef, useEffect } from "react";

interface SelectProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  className?: string;
  readOnly?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      label,
      value,
      options,
      onChange,
      placeholder,
      containerClassName = "",
      labelClassName = "",
      className = "",
      readOnly = false,
      onKeyDown,
      onFocus,
      isOpen: controlledIsOpen,
      onOpenChange,
    },
    ref
  ) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
    const setIsOpen = (open: boolean) => {
        if (onOpenChange) onOpenChange(open);
        if (!isControlled) setInternalIsOpen(open);
    };

    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((opt) =>
      opt.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
      if (!isOpen) {
        setSearch("");
      }
    }, [isOpen]);

    // Scroll to selected option
    useEffect(() => {
      if (isOpen && selectedIndex >= 0 && dropdownRef.current) {
        const selectedElement = dropdownRef.current.children[selectedIndex] as HTMLElement;
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }
    }, [selectedIndex, isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
            onChange(filteredOptions[selectedIndex]);
            setIsOpen(false);
          }
        } else if (e.key === "Escape" || e.key === "Tab") {
          setIsOpen(false);
        }
      }
      
      if (onKeyDown) onKeyDown(e);
    };

    return (
      <div className={`flex items-center space-x-2 min-w-0 relative ${containerClassName}`}>
        {label && (
          <label className={`text-sm font-semibold text-blue-900 ${labelClassName}`}>
            {label}
          </label>
        )}
        <div className="flex-1 relative">
          <input
            ref={ref}
            type="text"
            value={isOpen ? search : value}
            onChange={(e) => {
              if (!readOnly) {
                setSearch(e.target.value);
                if (!isOpen) {
                    setIsOpen(true);
                    // setSelectedIndex(0);
                }
                 if (e.target.value === "") {
                    // Allow clearing logic if needed, but for select usually we filter
                 }
              }
            }}
            onFocus={() => {
              if (onFocus) onFocus();
              // Don't auto-open on focus, wait for input or click
              // if (!readOnly) {
              //     setIsOpen(true);
              // }
            }}
            onClick={() => {
                if(!readOnly) setIsOpen(!isOpen)
            }}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            className={`w-full px-2 py-1 border border-gray-400 rounded text-sm bg-white cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
            placeholder={placeholder}
          />

          {isOpen && filteredOptions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 bg-white border border-gray-400 rounded-b max-h-40 overflow-y-auto z-20 shadow-lg"
            >
              {filteredOptions.map((option, i) => (
                <div
                  key={i}
                  className={`px-2 py-1 hover:bg-blue-100 cursor-pointer text-sm ${
                    i === selectedIndex ? "bg-blue-200" : ""
                  }`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        {!readOnly && (
            <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2 py-1 bg-gray-300 hover:bg-gray-400 border border-gray-500 rounded text-xs flex-shrink-0"
            tabIndex={-1}
            >
            ▼
            </button>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
