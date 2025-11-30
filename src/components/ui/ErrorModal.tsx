import React, { useEffect, useRef } from "react";
import { Button } from "./Button";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Validation Error",
  message,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "Escape") {
          onClose();
        }
      }}
      tabIndex={-1}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl text-center outline-none min-w-[300px] max-w-[500px]">
        <h3 className="text-lg font-bold text-red-600 mb-4">{title}</h3>
        <p className="text-base text-gray-800 mb-6 font-medium whitespace-pre-line">{message}</p>

        <div className="flex justify-center">
          <Button
            variant="primary"
            className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
            onClick={onClose}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
