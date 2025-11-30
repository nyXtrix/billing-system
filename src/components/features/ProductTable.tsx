import React from "react";
import { useProductTable } from "@/hooks/useProductTable";
import { tableColumns } from "@/constants";
import { Row } from "@/types";

interface ProductTableProps {
  tableState: ReturnType<typeof useProductTable>;
  onFocusPrevious?: () => void;
  onFocusRemarks?: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ tableState, onFocusPrevious, onFocusRemarks }) => {
  const {
    rows,
    handleChange,
    inputRefs,
    products,
    productDropdownOpen,
    setProductDropdownOpen,
    productSearch,
    productSelectedIndex,
    setProductSelectedIndex,
    selectProduct, 
    handleProductChange,
    handleTableKeyDown,
    productNotSelected
  } = tableState;

  // Wrapper for handleTableKeyDown to intercept ArrowUp on first row/product
  const onKeyDownWrapper = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      // IMPORTANT: If product dropdown is open, let handleTableKeyDown handle ALL keys
      // Don't intercept anything when dropdown is active
      if (productDropdownOpen === rowIndex && colIndex === 1) {
          console.log(">>> Dropdown is open, passing event to handleTableKeyDown");
          handleTableKeyDown(e, rowIndex, colIndex);
          return;
      }

      // Check if we are at first row and product column (colIndex 1 based on tableColumns)
      // tableColumns[1] is "PRODUCT"
      if (rowIndex === 0 && colIndex === 1 && e.key === "ArrowUp") {
          e.preventDefault();
          if (onFocusPrevious) {
              onFocusPrevious();
          }
          return;
      }

      // Check for Enter on empty product to jump to remarks
      // colIndex 1 is Product
      if (colIndex === 1 && e.key === "Enter") {
          const currentRow = rows[rowIndex];
          // If product is empty (and we are not selecting from dropdown which is handled by Enter usually, 
          // but here we want to skip if empty)
          if (!currentRow.product || currentRow.product.trim() === "") {
              e.preventDefault();
              if (onFocusRemarks) {
                  onFocusRemarks();
              }
              return;
          }
      }

      handleTableKeyDown(e, rowIndex, colIndex);
  };

  const renderTableCell = (
    row: Row,
    rowIndex: number,
    col: typeof tableColumns[0],
    colIndex: number
  ) => {
    if (col.readOnly) {
      return (
        <td
          key={col.key}
          className={`border border-gray-300 px-1 py-1 text-center ${
            col.key === "sno" ? "bg-gray-100 font-semibold" : "bg-gray-50"
          } ${col.align || ""}`}
        >
          {row[col.key as keyof Row]}
        </td>
      );
    }

    if (col.type === "select" && col.options) {
      return (
        <td key={col.key} className="border border-gray-300 px-1 py-1">
          <select
            ref={(el) => {
              if (!inputRefs.current[rowIndex])
                inputRefs.current[rowIndex] = [];
              inputRefs.current[rowIndex][colIndex] = el;
            }}
            value={row[col.key as keyof Row]}
            onChange={(e) =>
              handleChange(
                rowIndex,
                col.key as keyof Omit<Row, "sno" | "autoIncrement">,
                e.target.value
              )
            }
            onKeyDown={(e) => onKeyDownWrapper(e, rowIndex, colIndex)}
            className={`w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-yellow-100 focus:outline-none ${
              col.align || ""
            }`}
          >
            {col.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </td>
      );
    }

    if (col.type === "dropdown" && col.key === "product") {
      const filteredProducts = products.filter((product) =>
        product.toLowerCase().includes(productSearch.toLowerCase())
      );

      return (
        <td key={col.key} className={`border border-gray-300 px-1 py-1 relative ${productNotSelected[rowIndex] === rowIndex ? "bg-red-100" : ""}`}>
          <input
            ref={(el) => {
              if (!inputRefs.current[rowIndex])
                inputRefs.current[rowIndex] = [];
              inputRefs.current[rowIndex][colIndex] = el;
            }}
            type="text"
            value={
              productDropdownOpen === rowIndex
                ? productSearch
                : row[col.key as keyof Row]
            }
            onChange={(e) => handleProductChange(rowIndex, e.target.value)}
            onFocus={() => {
              // Always close dropdown on fresh focus to ensure clean state
              setProductDropdownOpen(null);
              setProductSelectedIndex(-1);
            }}
            onKeyDown={(e) => onKeyDownWrapper(e, rowIndex, colIndex)}
            className={`w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-yellow-100 focus:outline-none ${
              col.align || ""
            }`}
          />

          {productDropdownOpen === rowIndex && filteredProducts.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 bg-white border border-gray-400 rounded-b max-h-40 overflow-y-auto z-10"
            >
              {filteredProducts.map((option, i) => (
                <div
                  key={i}
                  className={`px-2 py-1 hover:bg-blue-100 cursor-pointer text-xs ${
                    i === productSelectedIndex ? "bg-blue-200" : ""
                  }`}
                  onClick={() => selectProduct(rowIndex, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </td>
      );
    }

    return (
      <td key={col.key} className="border border-gray-300 px-1 py-1">
        <input
          ref={(el) => {
            if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
            inputRefs.current[rowIndex][colIndex] = el;
          }}
          type="text"
          value={row[col.key as keyof Row]}
          onChange={(e) =>
            handleChange(
              rowIndex,
              col.key as keyof Omit<Row, "sno" | "autoIncrement">,
              e.target.value
            )
          }
          onKeyDown={(e) => handleTableKeyDown(e, rowIndex, colIndex)}
          className={`w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-yellow-100 focus:outline-none ${
            col.align || ""
          }`}
          readOnly={col.readOnly}
        />
      </td>
    );
  };

  const totalPieces = rows.reduce(
    (sum, r) => sum + (parseFloat(r.pieces) || 0),
    0
  );
  const totalWeight = rows.reduce(
    (sum, r) => sum + (parseFloat(r.weight) || 0),
    0
  );

  return (
    <div className="bg-white border-x-2 border-blue-300 overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            {tableColumns.map((col) => (
              <th
                key={col.key}
                className={`border border-blue-400 px-2 py-2 text-center ${col.width}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-blue-50">
              {tableColumns.map((col, colIndex) =>
                renderTableCell(row, rowIndex, col, colIndex)
              )}
            </tr>
          ))}
          <tr className="bg-gradient-to-r from-blue-200 to-blue-300 font-semibold">
            <td className="border border-gray-300 px-1 py-2" colSpan={7}></td>
            <td className="border border-gray-300 px-1 py-2 text-right text-sm">
              {totalPieces}
            </td>
            <td className="border border-gray-300 px-1 py-2 text-right text-sm">
              {totalWeight.toFixed(3)}
            </td>
            <td className="border border-gray-300 px-1 py-2" colSpan={3}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
