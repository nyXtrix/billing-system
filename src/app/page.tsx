"use client";
import { useRef, useState } from "react";

type Row = {
  sno: number;
  product: string;
  width: string;
  length: string;
  flop: string;
  gauge: string;
  remarks: string;
  pieces: string;
  weight: string;
  reqWgt: string;
  rateFor: string;
  rate: string;
};

type FormField = {
  label: string;
  key: string;
  type: "text" | "date" | "dropdown";
  width: string;
  grid: string;
  options?: string[];
};

const customerOptions = [
  "NITHIN KNIT CREATIONS",
  "TEXTILE INDUSTRIES LTD",
  "FASHION GARMENTS PVT LTD",
  "COTTON MILLS CORPORATION",
  "FABRIC SOLUTIONS INC",
  "KNITTING WORKS LIMITED",
  "GARMENT EXPORTS CO",
  "THREAD MANUFACTURING",
  "WEAVING INDUSTRIES",
  "APPAREL MAKERS LTD",
];

const measurementOptions = ["CM", "INCH"];
const rateForOptions = ["Piece", "Weight"];

const formFields: FormField[] = [
  {
    label: "ORDER NO",
    key: "orderNo",
    type: "text",
    width: "w-20",
    grid: "md:col-span-1",
  },
  {
    label: "ORDER DATE",
    key: "orderDate",
    type: "date",
    width: "w-24",
    grid: "md:col-span-1",
  },
  {
    label: "CUSTOMER",
    key: "customer",
    type: "dropdown",
    width: "w-20",
    grid: "md:col-span-1",
    options: customerOptions,
  },
  {
    label: "P.O.NO",
    key: "poNo",
    type: "text",
    width: "w-20",
    grid: "lg:col-span-1",
  },
  {
    label: "P.O.DATE",
    key: "poDate",
    type: "date",
    width: "w-24",
    grid: "lg:col-span-1",
  },
  {
    label: "DUE DATE",
    key: "dueDate",
    type: "date",
    width: "w-20",
    grid: "lg:col-span-1",
  },
  {
    label: "MEASUREMENT",
    key: "measurement",
    type: "dropdown",
    width: "w-28",
    grid: "lg:col-span-1",
    options: measurementOptions,
  },
];

const productOptions = [
  "T-Shirt",
  "Shirt",
  "Jeans",
  "Jacket",
  "Sweater",
  "Hoodie",
  "Pants",
  "Skirt",
  "Dress",
  "Socks",
];
type TableColumn = {
  key: string;
  header: string;
  width: string;
  type?: "text" | "select" | "dropdown";
  readOnly?: boolean;
  align?: string;
  options?: string[];
};
const tableColumns: TableColumn[] = [
  { key: "sno", header: "SNO", width: "w-12", readOnly: true },
  {
    key: "product",
    header: "PRODUCT",
    width: "w-48",
    type: "dropdown",
    options: productOptions,
  },
  {
    key: "width",
    header: "WIDTH",
    width: "w-20",
    type: "text",
    align: "text-right",
  },
  {
    key: "length",
    header: "LENGTH",
    width: "w-20",
    type: "text",
    align: "text-right",
  },
  {
    key: "flop",
    header: "FLOP",
    width: "w-16",
    type: "text",
    align: "text-right",
  },
  {
    key: "gauge",
    header: "GAUGE",
    width: "w-20",
    type: "text",
    align: "text-right",
  },
  { key: "remarks", header: "REMARKS", width: "w-24", type: "text" },
  {
    key: "pieces",
    header: "PIECES",
    width: "w-20",
    type: "text",
    align: "text-right",
  },
  {
    key: "weight",
    header: "WEIGHT",
    width: "w-20",
    type: "text",
    align: "text-right",
  },
  {
    key: "reqWgt",
    header: "REQ WGT",
    width: "w-24",
    type: "text",
    readOnly: true,
    align: "text-right",
  },
  {
    key: "rateFor",
    header: "RATE FOR",
    width: "w-24",
    type: "select",
    options: rateForOptions,
  },
  {
    key: "rate",
    header: "RATE",
    width: "w-20",
    type: "text",
    align: "text-right",
  },
];

const buttons = [
  "New",
  "Open",
  "Save",
  "Delete",
  "First",
  "Next",
  "Previous",
  "Last",
  "Preview",
  "Print",
];

export default function Home() {
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
  const inputRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[][]>(
    []
  );
  const remarksRef = useRef<HTMLTextAreaElement | null>(null);
  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 7 }, (_, i) => ({ sno: i + 1, ...emptyRow }))
  );
  const [productNotSelected, setProductNotSelected] = useState<
    (number | null)[]
  >(Array(rows.length).fill(null));

  const [formData, setFormData] = useState({
    orderNo: "415",
    orderDate: "2025-08-05",
    customer: "NITHIN KNIT CREATIONS",
    poNo: "254",
    poDate: "2025-08-05",
    dueDate: "2025-08-05",
    measurement: "INCH",
  });
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [measurementDropdownOpen, setMeasurementDropdownOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [remarks, setRemarks] = useState("");

  const filteredCustomers = customerOptions.filter((customer) =>
    customer.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const calculateReqWgt = (row: Omit<Row, "sno">): string => {
    const width = parseFloat(row.width) || 0;
    const length = parseFloat(row.length) || 0;
    const gauge = parseFloat(row.gauge) || 0;
    const pieces = parseFloat(row.pieces) || 0;
    if (width > 0 && length > 0 && gauge > 0 && pieces > 0) {
      const result = ((width * length) / (gauge / 3300) / 1000) * pieces;
      return result.toFixed(3);
    }
    return "0.000";
  };

  const validateInput = (field: string, value: string) => {
    switch (field) {
      case "width":
      case "length":
      case "flop":
      case "rate":
        return /^\d*(\.\d{0,2})?$/.test(value) ? value : "";
      case "gauge":
      case "pieces":
        return /^\d*$/.test(value) ? value : "";
      case "weight":
        return /^\d*(\.\d{0,3})?$/.test(value) ? value : "";
      case "product":
      case "remarks":
      case "rateFor":
        return value;
      default:
        return value;
    }
  };

  const handleChange = (
    index: number,
    field: keyof Omit<Row, "sno">,
    value: string
  ) => {
    const updated = [...rows];
    updated[index][field] = validateInput(field, value);
    if (["width", "length", "gauge", "pieces"].includes(field)) {
      updated[index].reqWgt = calculateReqWgt(updated[index]);
    }
    setRows(updated);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerSelect = (customer: string) => {
    handleFormChange("customer", customer);
    setCustomerDropdownOpen(false);
    setCustomerSearch("");
  };

  const totalPieces = rows.reduce(
    (sum, r) => sum + (parseFloat(r.pieces) || 0),
    0
  );
  const totalWeight = rows.reduce(
    (sum, r) => sum + (parseFloat(r.weight) || 0),
    0
  );
  const addRow = () => {
    setRows((prev) => [...prev, { sno: prev.length + 1, ...emptyRow }]);
    setProductNotSelected((prev) => [...prev, null]);
  };const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const totalCols = inputRefs.current[rowIndex]?.length || 0;
    const isLastCol = colIndex === totalCols - 1;
    const isLastRow = rowIndex === rows.length - 1;
    const isWeightColumn = tableColumns[colIndex]?.key === "weight";
    const isRateForColumn = tableColumns[colIndex]?.key === "rateFor";
    const isProductColumn = tableColumns[colIndex]?.key === "product";

    if (isProductColumn) {
      if (productDropdownOpen === rowIndex) {
        // Check if no product is selected (input is empty or unchanged)
        const currentProduct = rows[rowIndex].product;
        if (!currentProduct || !productOptions.includes(currentProduct)) {
          setProductNotSelected((prev) => {
            const updated = [...prev];
            updated[rowIndex] = rowIndex;
            return updated;
          });
        }
        setProductDropdownOpen(null);
        setProductSearch("");
      } else if (productNotSelected[rowIndex] === rowIndex) {
        // If product was not selected, move to remarks textarea
        if (remarksRef.current) {
          remarksRef.current.focus();
          setProductNotSelected((prev) => {
            const updated = [...prev];
            updated[rowIndex] = null;
            return updated;
          });
        }
      } else {
        // Normal navigation to next non-read-only column
        let nextColIndex = colIndex + 1;
        while (nextColIndex < totalCols && tableColumns[nextColIndex]?.readOnly) {
          nextColIndex++;
        }
        if (nextColIndex < totalCols) {
          inputRefs.current[rowIndex]?.[nextColIndex]?.focus();
        } else if (isLastRow) {
          addRow();
          setTimeout(() => {
            inputRefs.current[rowIndex + 1]?.[1]?.focus();
          }, 50);
        } else {
          inputRefs.current[rowIndex + 1]?.[1]?.focus();
        }
      }
    } else if (isWeightColumn) {
      const rateForIndex = tableColumns.findIndex(col => col.key === "rateFor");
      if (rateForIndex !== -1 && inputRefs.current[rowIndex]?.[rateForIndex]) {
        inputRefs.current[rowIndex][rateForIndex]?.focus();
        inputRefs.current[rowIndex][rateForIndex]?.dispatchEvent(new Event("focus", { bubbles: true }));
      }
    } else if (isRateForColumn) {
      const rateIndex = tableColumns.findIndex(col => col.key === "rate");
      if (rateIndex !== -1 && inputRefs.current[rowIndex]?.[rateIndex]) {
        inputRefs.current[rowIndex][rateIndex]?.focus();
      }
    } else if (!isLastCol) {
      let nextColIndex = colIndex + 1;
      while (nextColIndex < totalCols && tableColumns[nextColIndex]?.readOnly) {
        nextColIndex++;
      }
      if (nextColIndex < totalCols) {
        inputRefs.current[rowIndex]?.[nextColIndex]?.focus();
      }
    } else {
      if (isLastRow) {
        addRow();
        setTimeout(() => {
          inputRefs.current[rowIndex + 1]?.[1]?.focus();
        }, 50);
      } else {
        inputRefs.current[rowIndex + 1]?.[1]?.focus();
      }
    }
  }
};
  const [productDropdownOpen, setProductDropdownOpen] = useState<number | null>(
    null
  );
  const [productSearch, setProductSearch] = useState("");
  const renderFormField = (field: FormField, index: number) => {
    const isCustomer = field.key === "customer";
    const isMeasurement = field.key === "measurement";
    const isOpen = isCustomer ? customerDropdownOpen : measurementDropdownOpen;
    const setOpen = isCustomer
      ? setCustomerDropdownOpen
      : setMeasurementDropdownOpen;

    if (field.type === "dropdown") {
      return (
        <div
          key={field.key}
          className={`flex items-center space-x-2 min-w-0 relative ${field.grid}`}
        >
          <label
            className={`text-sm font-semibold text-blue-900 ${field.width}`}
          >
            {field.label}
          </label>
          <div className="flex-1 relative">
            <input
              type="text"
              value={
                isCustomer && isOpen
                  ? customerSearch
                  : formData[field.key as keyof typeof formData]
              }
              onChange={(e) =>
                isCustomer &&
                setCustomerSearch(e.target.value) &&
                setCustomerDropdownOpen(true)
              }
              onFocus={() => isCustomer && setCustomerDropdownOpen(true)}
              onClick={() => !isCustomer && setOpen(!isOpen)}
              readOnly={!isCustomer}
              className="w-full px-2 py-1 border border-gray-400 rounded text-sm bg-white cursor-pointer"
              placeholder={isCustomer ? "Search customer..." : undefined}
            />
            {isOpen && field.options && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-400 rounded-b max-h-40 overflow-y-auto z-10">
                {(isCustomer ? filteredCustomers : field.options).map(
                  (option, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 hover:bg-blue-100 cursor-pointer text-sm"
                      onClick={() => {
                        if (isCustomer) handleCustomerSelect(option);
                        else {
                          handleFormChange(field.key, option);
                          setOpen(false);
                        }
                      }}
                    >
                      {option}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setOpen(!isOpen)}
            className="px-2 py-1 bg-gray-300 hover:bg-gray-400 border border-gray-500 rounded text-xs flex-shrink-0"
          >
            ▼
          </button>
        </div>
      );
    }

    return (
      <div
        key={field.key}
        className={`flex items-center space-x-2 min-w-0 ${field.grid}`}
      >
        <label className={`text-sm font-semibold text-blue-900 ${field.width}`}>
          {field.label}
        </label>
        <input
          type={field.type}
          value={formData[field.key as keyof typeof formData]}
          onChange={(e) => handleFormChange(field.key, e.target.value)}
          className="flex-1 px-2 py-1 border border-gray-400 rounded text-sm bg-white min-w-0"
        />
      </div>
    );
  };

  const renderTableCell = (
    row: Row,
    rowIndex: number,
    col: TableColumn,
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
                col.key as keyof Omit<Row, "sno">,
                e.target.value
              )
            }
            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
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

    if (col.type === "dropdown" && col.options) {
      const filteredProducts = col.options.filter((product) =>
        product.toLowerCase().includes(productSearch.toLowerCase())
      );
      return (
        <td key={col.key} className="border border-gray-300 px-1 py-1 relative">
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
            onChange={(e) => {
              setProductSearch(e.target.value);
              setProductDropdownOpen(rowIndex);
            }}
            onFocus={() => setProductDropdownOpen(rowIndex)}
            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
            className={`w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-yellow-100 focus:outline-none ${
              col.align || ""
            }`}
            placeholder="Search product..."
          />
          {productDropdownOpen === rowIndex && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-400 rounded-b max-h-40 overflow-y-auto z-10">
              {filteredProducts.map((option, i) => (
                <div
                  key={i}
                  className="px-2 py-1 hover:bg-blue-100 cursor-pointer text-xs"
                  onClick={() => {
                    handleChange(
                      rowIndex,
                      col.key as keyof Omit<Row, "sno">,
                      option
                    );
                    setProductDropdownOpen(null);
                    setProductSearch("");
                  }}
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
              col.key as keyof Omit<Row, "sno">,
              e.target.value
            )
          }
          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
          className={`w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-yellow-100 focus:outline-none ${
            col.align || ""
          }`}
          readOnly={col.readOnly}
        />
      </td>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1.5 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-orange-600 rounded-sm flex items-center justify-center">
              <span className="text-xs font-bold">@</span>
            </div>
            <span className="font-semibold text-sm">
              TRANSACTIONS → JOB ORDER
            </span>
          </div>
          <div className="flex space-x-1">
            <button className="w-5 h-5 bg-orange-600 hover:bg-orange-700 rounded-sm flex items-center justify-center">
              <span className="text-xs font-bold">−</span>
            </button>
            <button className="w-5 h-5 bg-red-500 hover:bg-red-600 rounded-sm flex items-center justify-center">
              <span className="text-xs font-bold">×</span>
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-4 border-x-2 border-blue-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {formFields.slice(0, 3).map(renderFormField)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {formFields.slice(3).map(renderFormField)}
          </div>
        </div>

        {/* Table Section */}
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
                <td
                  className="border border-gray-300 px-1 py-2"
                  colSpan={7}
                ></td>
                <td className="border border-gray-300 px-1 py-2 text-right text-sm">
                  {totalPieces}
                </td>
                <td className="border border-gray-300 px-1 py-2 text-right text-sm">
                  {totalWeight.toFixed(3)}
                </td>
                <td
                  className="border border-gray-300 px-1 py-2"
                  colSpan={3}
                ></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Remarks Section */}
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-4 border-x-2 border-blue-300">
          <div className="flex items-start space-x-2">
            <label className="text-sm font-semibold text-blue-900 w-20 mt-1">
              REMARKS
            </label>
            <textarea
              ref={remarksRef}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-400 rounded text-sm bg-white h-16 resize-none"
              placeholder="Enter remarks here..."
            />
          </div>
          <div className="text-right mt-2 text-xs text-blue-800">
            Entered By <span className="font-semibold">ADMIN</span> @ 05/08/2025
            10:30AM
          </div>
        </div>

        {/* Button Section */}
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-4 rounded-b-lg border-2 border-blue-300 border-t-0">
          <div className="flex flex-wrap gap-2">
            {buttons.map((label) => (
              <button
                key={label}
                className="px-4 py-2 bg-gradient-to-b from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 border border-gray-400 rounded text-sm font-semibold text-gray-800 shadow-sm"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
