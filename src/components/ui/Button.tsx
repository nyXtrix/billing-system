import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "icon";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseStyles = "rounded font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  const variants = {
    primary: "px-4 py-2 bg-gradient-to-b from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 border border-gray-400 text-gray-800 focus:ring-gray-400 text-sm",
    secondary: "px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-400 text-sm",
    danger: "px-3 py-1 bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 text-sm",
    icon: "w-5 h-5 flex items-center justify-center rounded-sm text-xs font-bold text-white",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
