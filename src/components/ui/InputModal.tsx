import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message?: string;
  placeholder?: string;
  inputLabel?: string;
}

export const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = "Enter value...",
  inputLabel = "Value",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [focusedButton, setFocusedButton] = useState<"ok" | "cancel">("ok");

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      if (modalRef.current) {
        modalRef.current.focus();
      }
      // Focus input after a short delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (inputValue.trim()) {
      onConfirm(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      setFocusedButton((prev) => (prev === "ok" ? "cancel" : "ok"));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl text-center outline-none min-w-[400px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}

        <div className="mb-6 text-left">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {inputLabel}
          </label>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="secondary"
            className={focusedButton === "cancel" ? "ring-2 ring-gray-500" : ""}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className={focusedButton === "ok" ? "ring-2 ring-blue-600" : ""}
            onClick={handleConfirm}
            disabled={!inputValue.trim()}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
