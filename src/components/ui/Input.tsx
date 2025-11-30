import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, containerClassName = "", labelClassName = "", className = "", ...props }, ref) => {
    return (
      <div className={`flex items-center space-x-2 min-w-0 ${containerClassName}`}>
        {label && (
          <label className={`text-sm font-semibold text-blue-900 ${labelClassName}`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`flex-1 px-2 py-1 border border-gray-400 rounded text-sm bg-white min-w-0 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
