import { useState, useRef } from "react";
import { Row } from "@/types";
import { calculateReqWgt } from "@/utils/formatters";
import { validateInput } from "@/utils/validators";
import { tableColumns } from "@/constants";

const emptyRow: Omit<Row, "sno"> = {
  product: "",
  width: "",
  length: "",
  flop: "",
  gauge: "",
  remarks: "",
  pieces: "",
  weight: "",
  reqWgt: "",
  rateFor: "Piece",
  rate: "",
};

export const useProductTable = (products: string[] = [], initialRows: number = 7) => {
  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: initialRows }, (_, i) => ({ sno: i + 1, ...emptyRow }))
  );
  
  // Ref to track input elements for navigation
  const inputRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[][]>([]);
  
  // State for product dropdowns
  const [productDropdownOpen, setProductDropdownOpen] = useState<number | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productSelectedIndex, setProductSelectedIndex] = useState<number>(-1);
  const [productNotSelected, setProductNotSelected] = useState<(number | null)[]>(
    Array(initialRows).fill(null)
  );

  const addRow = () => {
    setRows((prev) => [...prev, { sno: prev.length + 1, ...emptyRow }]);
    setProductNotSelected((prev) => [...prev, null]);
  };

  const handleChange = (
    index: number,
    field: keyof Omit<Row, "sno" | "autoIncrement">,
    value: string
  ) => {
    const updated = [...rows];
    updated[index][field] = validateInput(field, value);
    
    if (["width", "length", "gauge", "pieces"].includes(field)) {
      updated[index].reqWgt = calculateReqWgt(
        updated[index].width,
        updated[index].length,
        updated[index].gauge,
        updated[index].pieces
      );
    }
    setRows(updated);
  };

  const handleProductChange = (rowIndex: number, value: string) => {
      console.log("=== handleProductChange ===");
      console.log("Row:", rowIndex, "Value:", value);
      setProductSearch(value);
      if (value === "") {
           const updated = [...rows];
           updated[rowIndex].product = "";
           setRows(updated);
      }
      setProductDropdownOpen(rowIndex);
      setProductSelectedIndex(0);
      console.log("Dropdown opened for row:", rowIndex);
  };

  const selectProduct = (rowIndex: number, product: string) => {
      handleChange(rowIndex, "product", product);
      setProductDropdownOpen(null);
      setProductSearch("");
      setProductSelectedIndex(-1);
      
      // Move focus to next editable cell
      const colIndex = tableColumns.findIndex(col => col.key === "product");
      let nextColIndex = colIndex + 1;
      while (
        nextColIndex < tableColumns.length &&
        tableColumns[nextColIndex]?.readOnly
      ) {
        nextColIndex++;
      }
      if (nextColIndex < tableColumns.length) {
        inputRefs.current[rowIndex]?.[nextColIndex]?.focus();
      }
  };

  const handleTableKeyDown = (
    e: React.KeyboardEvent,
    rowIndex: number,
    colIndex: number
  ) => {
    const col = tableColumns[colIndex];
    const totalCols = tableColumns.length;
    const totalRows = rows.length;

    // Check if this is a dropdown column (product column or other dropdowns with options)
    const isDropdown = col.type === "dropdown" && (col.key === "product" || col.options);

    console.log("=== handleTableKeyDown ===");
    console.log("Key pressed:", e.key);
    console.log("Column:", col.key, "Type:", col.type);
    console.log("isDropdown:", isDropdown);
    console.log("productDropdownOpen:", productDropdownOpen, "rowIndex:", rowIndex);
    console.log("productSelectedIndex:", productSelectedIndex);

    // Handle dropdown navigation first (specifically for product dropdown)
    if (isDropdown && col.key === "product" && productDropdownOpen === rowIndex) {
      console.log(">>> INSIDE PRODUCT DROPDOWN NAVIGATION");
      const filteredProducts = products.filter((product: string) =>
        product.toLowerCase().includes(productSearch.toLowerCase())
      );
      console.log("Filtered products count:", filteredProducts.length);
      console.log("Current search:", productSearch);
      
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        console.log(">>> Arrow key detected in dropdown");
        let newIndex = productSelectedIndex;
        if (e.key === "ArrowDown") {
          newIndex =
            productSelectedIndex < filteredProducts.length - 1
              ? productSelectedIndex + 1
              : 0;
        } else {
          newIndex =
            productSelectedIndex > 0
              ? productSelectedIndex - 1
              : filteredProducts.length - 1;
        }
        console.log("Setting new index:", newIndex);
        setProductSelectedIndex(newIndex);
        return;
      } else if (e.key === "Enter") {
        e.preventDefault();
        console.log(">>> Enter key detected in dropdown");
        if (filteredProducts[productSelectedIndex]) {
          console.log("Selecting product:", filteredProducts[productSelectedIndex]);
          selectProduct(rowIndex, filteredProducts[productSelectedIndex]);
        }
        return;
      }
    }

    // Arrow Up / Down moves between rows (skip readOnly columns)
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      let nextCol = colIndex;
      if (e.key === "ArrowDown") {
        // Next column (wrap around to first if at end)
        nextCol = (colIndex + 1) % totalCols;
      } else {
        // Previous column (wrap around to last if at start)
        nextCol = colIndex === 0 ? totalCols - 1 : colIndex - 1;
      }
      // Skip readOnly columns
      while (nextCol < totalCols && tableColumns[nextCol]?.readOnly) {
        nextCol = (nextCol + 1) % totalCols;
      }
      if (inputRefs.current[rowIndex]?.[nextCol]) {
        inputRefs.current[rowIndex][nextCol]?.focus();
      }
      return;
    }

    // Keyboard shortcuts for Rate For column: P = Piece, W = Weight
    if (col.key === "rateFor" && (e.key === "p" || e.key === "P" || e.key === "w" || e.key === "W")) {
      e.preventDefault();
      const newValue = (e.key === "p" || e.key === "P") ? "Piece" : "Weight";
      handleChange(rowIndex, "rateFor", newValue);
      console.log(`Rate For changed to: ${newValue} using keyboard shortcut`);
      return;
    }

    // Enter moves to next editable cell in the same row
    if (e.key === "Enter") {
      e.preventDefault();
      
      // Check if product is selected if we are leaving product column
      if (col.key === "product") {
          const currentProduct = rows[rowIndex].product;
          if (!currentProduct || !products.includes(currentProduct)) {
            setProductNotSelected((prev) => {
              const updated = [...prev];
              updated[rowIndex] = rowIndex;
              return updated;
            });
            // Don't block navigation? The snippet blocks if product dropdown is open, but if just leaving...
            // Snippet logic: if productDropdownOpen, select it. If not open, check if valid.
            // If invalid, setProductNotSelected.
            // Then it continues to move focus?
            // Snippet: if (productDropdownOpen === rowIndex) { ... } else if (isProductCol) { ... }
            // If product is empty, it focuses remarksRef (which is outside table).
            // Let's stick to simple navigation for now, but keep productNotSelected logic.
          }
      }



      let nextCol = colIndex + 1;
      while (nextCol < totalCols && tableColumns[nextCol].readOnly) nextCol++;
      if (nextCol < totalCols) {
        inputRefs.current[rowIndex][nextCol]?.focus();
      } else {
        // Move to first editable cell in next row
        const nextRow = rowIndex + 1;
        if (nextRow < totalRows) {
          let firstCol = 0;
          while (firstCol < totalCols && tableColumns[firstCol].readOnly)
            firstCol++;
          inputRefs.current[nextRow][firstCol]?.focus();
        } else {
          // Last row → add a new row
          addRow();
          setTimeout(() => {
            let firstCol = 0;
            while (firstCol < totalCols && tableColumns[firstCol].readOnly)
              firstCol++;
            if (inputRefs.current[rowIndex + 1]) {
                inputRefs.current[rowIndex + 1][firstCol]?.focus();
            }
          }, 50);
        }
      }
    }
  };

  return {
    rows,
    setRows,
    addRow,
    handleChange,
    inputRefs,
    products, // Return products for use in ProductTable
    productDropdownOpen,
    setProductDropdownOpen,
    productSearch,
    setProductSearch,
    productSelectedIndex,
    setProductSelectedIndex,
    selectProduct,
    handleProductChange,
    productNotSelected,
    setProductNotSelected,
    handleTableKeyDown
  };
};
