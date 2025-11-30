import React, { useEffect, useRef } from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [focusedButton, setFocusedButton] = React.useState<"yes" | "cancel">("yes");

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
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          setFocusedButton((prev) => (prev === "yes" ? "cancel" : "yes"));
        }
        if (e.key === "Enter") {
          if (focusedButton === "yes") {
            onConfirm();
          } else {
            onClose();
          }
        }
        if (e.key === "Escape") {
            onClose();
        }
      }}
      tabIndex={-1}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl text-center outline-none min-w-[300px]">
        <p className="text-base text-gray-800 mb-6 font-medium">{message}</p>

        <div className="flex justify-center gap-4">
          <Button
            variant={focusedButton === "cancel" ? "secondary" : "secondary"} // Visual cue handled by focus ring or custom style if needed, but simple toggle is fine
            className={focusedButton === "cancel" ? "ring-2 ring-gray-500 bg-gray-400 text-white" : ""}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className={focusedButton === "yes" ? "ring-2 ring-blue-500 bg-blue-600 text-white border-blue-600" : "bg-blue-400 text-white border-blue-400"}
            onClick={onConfirm}
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};
