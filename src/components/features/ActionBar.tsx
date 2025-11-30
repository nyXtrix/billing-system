import React from "react";
import { Button } from "@/components/ui/Button";
import { buttons } from "@/constants";

interface ActionBarProps {
  onSave: () => void;
  onOpen?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ onSave, onOpen }) => {
  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-4 rounded-b-lg border-2 border-blue-300 border-t-0 shadow-md">
      <div className="flex flex-wrap gap-2">
        {buttons.map((label) => (
          <Button
            key={label}
            variant="primary"
            onClick={() => {
                if (label === "Save") onSave();
                if (label === "Open" && onOpen) onOpen();
            }}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
