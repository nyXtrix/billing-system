import React from "react";

export const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1.5 rounded-t-lg flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="w-5 h-5 bg-orange-600 rounded-sm flex items-center justify-center shadow-inner">
          <span className="text-xs font-bold">@</span>
        </div>
        <span className="font-semibold text-sm tracking-wide">
          TRANSACTIONS → JOB ORDER
        </span>
      </div>
      <div className="flex space-x-1">
        <button className="w-5 h-5 bg-orange-600 hover:bg-orange-700 rounded-sm flex items-center justify-center transition-colors">
          <span className="text-xs font-bold">−</span>
        </button>
        <button className="w-5 h-5 bg-red-500 hover:bg-red-600 rounded-sm flex items-center justify-center transition-colors">
          <span className="text-xs font-bold">×</span>
        </button>
      </div>
    </div>
  );
};
