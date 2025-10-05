"use client";
import { useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  "APPAREL MAKERS LTD",
  "COTTON MILLS CORPORATION",
  "ELITE GARMENTS CO",
  "FABRIC SOLUTIONS INC",
  "FASHION GARMENTS PVT LTD",
  "GARMENT EXPORTS CO",
  "GLOBAL TEXTILES CO",
  "KNITTING WORKS LIMITED",
  "MASTER WEAVERS CORP",
  "NITHIN KNIT CREATIONS",
  "PREMIUM FABRICS LTD",
  "QUALITY KNITS INC",
  "TEXTILE INDUSTRIES LTD",
  "THREAD MANUFACTURING",
  "WEAVING INDUSTRIES",
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
  "Blouse",
  "Coat",
  "Dress",
  "Hoodie",
  "Jacket",
  "Jeans",
  "Pants",
  "Shirt",
  "Shorts",
  "Skirt",
  "Socks",
  "Sweater",
  "T-Shirt",
  "Uniform",
  "Vest",
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [focusedButton, setFocusedButton] = useState<"yes" | "cancel">("yes");

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
  const formInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const datePickerRefs = useRef<(DatePicker | null)[]>([]);
  const remarksRef = useRef<HTMLInputElement | null>(null);
  const customerDropdownRef = useRef<HTMLDivElement>(null);
  const measurementDropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 7 }, (_, i) => ({ sno: i + 1, ...emptyRow }))
  );
  const [productNotSelected, setProductNotSelected] = useState<
    (number | null)[]
  >(Array(rows.length).fill(null));

  // Date states
  const [orderDate, setOrderDate] = useState<Date | null>(
    new Date("2025-08-05")
  );
  const [poDate, setPoDate] = useState<Date | null>(new Date("2025-08-05"));
  const [dueDate, setDueDate] = useState<Date | null>(new Date("2025-08-05"));
  const [datePickerOpen, setDatePickerOpen] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    orderNo: "415",
    customer: "NITHIN KNIT CREATIONS",
    poNo: "254",
    measurement: "INCH",
  });
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [measurementDropdownOpen, setMeasurementDropdownOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [remarks, setRemarks] = useState("");
  const [productDropdownOpen, setProductDropdownOpen] = useState<number | null>(
    null
  );
  const [productSearch, setProductSearch] = useState("");

  // New states for dropdown navigation
  const [customerSelectedIndex, setCustomerSelectedIndex] = useState(-1);
  const [measurementSelectedIndex, setMeasurementSelectedIndex] = useState(-1);
  const [productSelectedIndex, setProductSelectedIndex] = useState<number>(-1);

  const filteredCustomers = customerOptions.filter((customer) =>
    customer.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showConfirmModal && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showConfirmModal]);

  // Scroll to selected option in dropdown
  useEffect(() => {
    if (
      customerDropdownOpen &&
      customerSelectedIndex >= 0 &&
      customerDropdownRef.current
    ) {
      const selectedElement = customerDropdownRef.current.children[
        customerSelectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [customerSelectedIndex, customerDropdownOpen]);

  useEffect(() => {
    if (
      measurementDropdownOpen &&
      measurementSelectedIndex >= 0 &&
      measurementDropdownRef.current
    ) {
      const selectedElement = measurementDropdownRef.current.children[
        measurementSelectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [measurementSelectedIndex, measurementDropdownOpen]);

  useEffect(() => {
    if (
      productDropdownOpen !== null &&
      productSelectedIndex >= 0 &&
      productDropdownRefs.current[productDropdownOpen]
    ) {
      const selectedElement = productDropdownRefs.current[productDropdownOpen]
        ?.children[productSelectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [productSelectedIndex, productDropdownOpen]);

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

  const onkeyFormKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // If date picker is open, close it and move to next
      if (datePickerOpen !== null) {
        setDatePickerOpen(null);
        const nextIndex = index + 1;
        if (formFields[nextIndex] && formInputRefs.current[nextIndex]) {
          formInputRefs.current[nextIndex]?.focus();
        }
        return;
      }

      // If dropdown is open and has selection, apply it
      if (
        customerDropdownOpen &&
        customerSelectedIndex >= 0 &&
        filteredCustomers[customerSelectedIndex]
      ) {
        handleCustomerSelect(filteredCustomers[customerSelectedIndex]);
        const nextIndex = index + 1;
        if (formFields[nextIndex] && formInputRefs.current[nextIndex]) {
          formInputRefs.current[nextIndex]?.focus();
        }
        return;
      }

      if (
        measurementDropdownOpen &&
        measurementSelectedIndex >= 0 &&
        measurementOptions[measurementSelectedIndex]
      ) {
        handleMeasurementSelect(measurementOptions[measurementSelectedIndex]);
        const nextIndex = index + 1;
        if (formFields[nextIndex] && formInputRefs.current[nextIndex]) {
          formInputRefs.current[nextIndex]?.focus();
        }
        return;
      }

      const nextIndex = index + 1;
      if (formFields[nextIndex]) {
        const nextField = formFields[nextIndex];
        const nextRef = formInputRefs.current[nextIndex];

        if (nextRef) {
          nextRef.focus();

          if (nextField.type === "dropdown") {
            if (nextField.key === "customer") {
              setCustomerDropdownOpen(true);
              setMeasurementDropdownOpen(false);
              setCustomerSelectedIndex(0);
            } else if (nextField.key === "measurement") {
              setCustomerDropdownOpen(false);
              setMeasurementDropdownOpen(true);
              setMeasurementSelectedIndex(0);
            } else {
              setMeasurementDropdownOpen(false);
              setCustomerDropdownOpen(false);
            }
          } else if (nextField.type === "date") {
            // Open date picker for date fields
            setDatePickerOpen(nextIndex);
            setCustomerDropdownOpen(false);
            setMeasurementDropdownOpen(false);
          }
        }
      } else {
        setMeasurementDropdownOpen(false);
        setCustomerDropdownOpen(false);
        setDatePickerOpen(null);
        setTimeout(() => {
          inputRefs.current[0]?.[1]?.focus();
        }, 50);
      }
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      // Handle dropdown navigation for form fields
      const isCustomer = formFields[index].key === "customer";
      const isMeasurement = formFields[index].key === "measurement";

      if (
        (isCustomer && customerDropdownOpen) ||
        (isMeasurement && measurementDropdownOpen)
      ) {
        e.preventDefault();
        const options = isCustomer
          ? filteredCustomers
          : formFields[index].options || [];
        const currentIndex = isCustomer
          ? customerSelectedIndex
          : measurementSelectedIndex;
        let newIndex = currentIndex;

        if (e.key === "ArrowDown") {
          newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        } else if (e.key === "ArrowUp") {
          newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        }

        if (isCustomer) {
          setCustomerSelectedIndex(newIndex);
        } else {
          setMeasurementSelectedIndex(newIndex);
        }
      }
    } else if (e.key === "Tab") {
      // Close dropdowns on tab
      setCustomerDropdownOpen(false);
      setMeasurementDropdownOpen(false);
      setDatePickerOpen(null);
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
    setCustomerSelectedIndex(-1);
  };

  const handleMeasurementSelect = (measurement: string) => {
    handleFormChange("measurement", measurement);
    setMeasurementDropdownOpen(false);
    setMeasurementSelectedIndex(-1);
  };

  // Date change handlers
  const handleOrderDateChange = (date: Date | null) => {
    setOrderDate(date);
    setDatePickerOpen(null);
    // Move to next field after date selection
    setTimeout(() => {
      const customerIndex = formFields.findIndex(
        (field) => field.key === "customer"
      );
      if (formInputRefs.current[customerIndex]) {
        formInputRefs.current[customerIndex]?.focus();
      }
    }, 50);
  };

  const handlePoDateChange = (date: Date | null) => {
    setPoDate(date);
    setDatePickerOpen(null);
    // Move to next field after date selection
    setTimeout(() => {
      const dueDateIndex = formFields.findIndex(
        (field) => field.key === "dueDate"
      );
      if (formInputRefs.current[dueDateIndex]) {
        formInputRefs.current[dueDateIndex]?.focus();
      }
    }, 50);
  };

  const handleDueDateChange = (date: Date | null) => {
    setDueDate(date);
    setDatePickerOpen(null);
    // Move to next field after date selection
    setTimeout(() => {
      const measurementIndex = formFields.findIndex(
        (field) => field.key === "measurement"
      );
      if (formInputRefs.current[measurementIndex]) {
        formInputRefs.current[measurementIndex]?.focus();
      }
    }, 50);
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
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    rowIndex: number,
    colIndex: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // If product dropdown is open and has selection, apply it and move to next field
      if (productDropdownOpen === rowIndex && productSelectedIndex >= 0) {
        const filteredProducts = productOptions.filter((product) =>
          product.toLowerCase().includes(productSearch.toLowerCase())
        );
        if (filteredProducts[productSelectedIndex]) {
          handleChange(
            rowIndex,
            "product",
            filteredProducts[productSelectedIndex]
          );
          setProductDropdownOpen(null);
          setProductSearch("");
          setProductSelectedIndex(-1);

          // Move to next field
          let nextColIndex = colIndex + 1;
          while (
            nextColIndex < tableColumns.length &&
            tableColumns[nextColIndex]?.readOnly
          ) {
            nextColIndex++;
          }
          if (nextColIndex < tableColumns.length) {
            setTimeout(() => {
              inputRefs.current[rowIndex]?.[nextColIndex]?.focus();
            }, 50);
          }
          return;
        }
      }

      const totalCols = inputRefs.current[rowIndex]?.length || 0;
      const isLastCol = colIndex === totalCols - 1;
      const isLastRow = rowIndex === rows.length - 1;
      const isWeightColumn = tableColumns[colIndex]?.key === "weight";
      const isRateForColumn = tableColumns[colIndex]?.key === "rateFor";
      const isProductColumn = tableColumns[colIndex]?.key === "product";

      if (isProductColumn) {
        if (productDropdownOpen === rowIndex) {
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
          setProductSelectedIndex(-1);
        } else if (productNotSelected[rowIndex] === rowIndex) {
          if (remarksRef.current) {
            remarksRef.current.focus();
            setProductNotSelected((prev) => {
              const updated = [...prev];
              updated[rowIndex] = null;
              return updated;
            });
          }
        } else {
          let nextColIndex = colIndex + 1;
          while (
            nextColIndex < totalCols &&
            tableColumns[nextColIndex]?.readOnly
          ) {
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
        const rateForIndex = tableColumns.findIndex(
          (col) => col.key === "rateFor"
        );
        if (
          rateForIndex !== -1 &&
          inputRefs.current[rowIndex]?.[rateForIndex]
        ) {
          inputRefs.current[rowIndex][rateForIndex]?.focus();
          inputRefs.current[rowIndex][rateForIndex]?.dispatchEvent(
            new Event("focus", { bubbles: true })
          );
        }
      } else if (isRateForColumn) {
        const rateIndex = tableColumns.findIndex((col) => col.key === "rate");
        if (rateIndex !== -1 && inputRefs.current[rowIndex]?.[rateIndex]) {
          inputRefs.current[rowIndex][rateIndex]?.focus();
        }
      } else if (!isLastCol) {
        let nextColIndex = colIndex + 1;
        while (
          nextColIndex < totalCols &&
          tableColumns[nextColIndex]?.readOnly
        ) {
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
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      // Handle dropdown navigation for product cells
      const col = tableColumns[colIndex];
      if (col.type === "dropdown" && productDropdownOpen === rowIndex) {
        e.preventDefault();
        const filteredProducts = productOptions.filter((product) =>
          product.toLowerCase().includes(productSearch.toLowerCase())
        );

        let newIndex = productSelectedIndex;

        if (e.key === "ArrowDown") {
          newIndex =
            productSelectedIndex < filteredProducts.length - 1
              ? productSelectedIndex + 1
              : 0;
        } else if (e.key === "ArrowUp") {
          newIndex =
            productSelectedIndex > 0
              ? productSelectedIndex - 1
              : filteredProducts.length - 1;
        }

        setProductSelectedIndex(newIndex);
      }
    } else if (e.key === "Tab") {
      // Close product dropdown on tab
      setProductDropdownOpen(null);
      setProductSelectedIndex(-1);
    }
  };

  // Custom input component for DatePicker to integrate with our ref system
  const CustomDateInput = ({
    value,
    onClick,
    onChange,
    onKeyDown,
    refIndex,
  }: {
    value?: string;
    onClick?: () => void;
    onChange?: () => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    refIndex: number;
  }) => (
    <input
      ref={(el) => {
        formInputRefs.current[refIndex] = el;
      }}
      type="text"
      value={value}
      onClick={onClick}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={() => setDatePickerOpen(refIndex)}
      className="flex-1 px-2 py-1 border border-gray-400 rounded text-sm bg-white min-w-0 cursor-pointer"
      readOnly
    />
  );

  const renderFormField = (field: FormField, index: number) => {
    const isCustomer = field.key === "customer";
    const isMeasurement = field.key === "measurement";
    const isDate = field.type === "date";
    const isOpen = isCustomer ? customerDropdownOpen : measurementDropdownOpen;
    const setOpen = isCustomer
      ? setCustomerDropdownOpen
      : setMeasurementDropdownOpen;
    const selectedIndex = isCustomer
      ? customerSelectedIndex
      : measurementSelectedIndex;
    const options = isCustomer ? filteredCustomers : field.options || [];

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
              ref={(el) => {
                formInputRefs.current[index] = el;
              }}
              type="text"
              value={
                isCustomer && isOpen
                  ? customerSearch
                  : formData[field.key as keyof typeof formData]
              }
              onChange={(e) => {
                if (isCustomer) {
                  setCustomerSearch(e.target.value);
                  setCustomerDropdownOpen(true);
                  setCustomerSelectedIndex(0); // Auto-select first option when searching
                }
              }}
              onFocus={() => {
                if (isCustomer) {
                  setCustomerDropdownOpen(true);
                  setCustomerSelectedIndex(0); // Auto-select first option on focus
                } else if (isMeasurement) {
                  setMeasurementDropdownOpen(true);
                  setMeasurementSelectedIndex(0); // Auto-select first option on focus
                }
              }}
              onClick={() => {
                if (!isCustomer) {
                  setOpen(!isOpen);
                  if (isMeasurement) setMeasurementSelectedIndex(0);
                }
              }}
              onKeyDown={(e) => onkeyFormKeyDown(e, index)}
              readOnly={!isCustomer}
              className="w-full px-2 py-1 border border-gray-400 rounded text-sm bg-white cursor-pointer"
              placeholder={isCustomer ? "Search customer..." : undefined}
            />
            {isOpen && options.length > 0 && (
              <div
                ref={isCustomer ? customerDropdownRef : measurementDropdownRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-400 rounded-b max-h-40 overflow-y-auto z-10"
              >
                {options.map((option, i) => (
                  <div
                    key={i}
                    className={`px-2 py-1 hover:bg-blue-100 cursor-pointer text-sm ${
                      i === selectedIndex ? "bg-blue-200" : ""
                    }`}
                    onClick={() => {
                      if (isCustomer) {
                        handleCustomerSelect(option);
                      } else {
                        handleMeasurementSelect(option);
                      }
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setOpen(!isOpen);
              if (isCustomer && !isOpen) setCustomerSelectedIndex(0);
              if (isMeasurement && !isOpen) setMeasurementSelectedIndex(0);
            }}
            className="px-2 py-1 bg-gray-300 hover:bg-gray-400 border border-gray-500 rounded text-xs flex-shrink-0"
          >
            ▼
          </button>
        </div>
      );
    }

    if (isDate) {
      let dateValue: Date | null = null;
      let onChangeHandler: (date: Date | null) => void = () => {};

      if (field.key === "orderDate") {
        dateValue = orderDate;
        onChangeHandler = handleOrderDateChange;
      } else if (field.key === "poDate") {
        dateValue = poDate;
        onChangeHandler = handlePoDateChange;
      } else if (field.key === "dueDate") {
        dateValue = dueDate;
        onChangeHandler = handleDueDateChange;
      }

      

      return (
        <div
          key={field.key}
          className={`flex items-center space-x-2 min-w-0 ${field.grid}`}
        >
          <label
            className={`text-sm font-semibold text-blue-900 ${field.width}`}
          >
            {field.label}
          </label>
          <div className="flex-1 relative">
            <DatePicker
              ref={(el) => {
                datePickerRefs.current[index] = el;
              }}
              selected={dateValue}
              onChange={onChangeHandler}
              onKeyDown={(e) => onkeyFormKeyDown(e, index)}
              open={datePickerOpen === index}
              onFocus={() => setDatePickerOpen(index)}
              onClickOutside={() => setDatePickerOpen(null)}
              customInput={<CustomDateInput refIndex={index} />}
              showPopperArrow={false}
              popperClassName="!z-20"
              calendarClassName="!border !border-gray-400 !rounded !shadow-lg"
              dayClassName={(date) =>
                date.getDate() === dateValue?.getDate() &&
                date.getMonth() === dateValue?.getMonth() &&
                date.getFullYear() === dateValue?.getFullYear()
                  ? "!bg-blue-500 !text-white"
                  : "hover:!bg-blue-100"
              }
            />
          </div>
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
          ref={(el) => {
            formInputRefs.current[index] = el;
          }}
          type={field.type}
          value={formData[field.key as keyof typeof formData]}
          onChange={(e) => handleFormChange(field.key, e.target.value)}
          onKeyDown={(e) => onkeyFormKeyDown(e, index)}
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
              setProductSelectedIndex(-1); // Auto-select first option when searching
            }}
            onFocus={() => {
              setProductDropdownOpen(rowIndex);
              setProductSelectedIndex(-1); // Auto-select first option on focus
            }}
            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
            className={`w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-yellow-100 focus:outline-none ${
              col.align || ""
            }`}
            placeholder="Search product..."
          />
          {productDropdownOpen === rowIndex && filteredProducts.length > 0 && (
            <div
              ref={(el) => {
                productDropdownRefs.current[rowIndex] = el;
              }}
              className="absolute top-full left-0 right-0 bg-white border border-gray-400 rounded-b max-h-40 overflow-y-auto z-10"
            >
              {filteredProducts.map((option, i) => (
                <div
                  key={i}
                  className={`px-2 py-1 hover:bg-blue-100 cursor-pointer text-xs ${
                    i === productSelectedIndex ? "bg-blue-200" : ""
                  }`}
                  onClick={() => {
                    handleChange(
                      rowIndex,
                      col.key as keyof Omit<Row, "sno">,
                      option
                    );
                    setProductDropdownOpen(null);
                    setProductSearch("");
                    setProductSelectedIndex(-1);

                    // Move to next field after selection
                    setTimeout(() => {
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
                    }, 50);
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

    const handleTableKeyDown = (
        e: React.KeyboardEvent,
        rowIndex: number,
        colIndex: number
      ) => {
        const col = tableColumns[colIndex];
        const totalCols = tableColumns.length;
        const totalRows = rows.length;

        const isDropdown = col.type === "dropdown" && col.options;

        // Handle dropdown navigation first
        if (isDropdown && productDropdownOpen === rowIndex) {
          const filteredProducts = col.options!.filter((product) =>
            product.toLowerCase().includes(productSearch.toLowerCase())
          );
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
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
            setProductSelectedIndex(newIndex);
            return;
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (filteredProducts[productSelectedIndex]) {
              handleChange(
                rowIndex,
                col.key as keyof Omit<Row, "sno">,
                filteredProducts[productSelectedIndex]
              );
              setProductDropdownOpen(null);
              setProductSearch("");
              setProductSelectedIndex(-1);

              // Move to next editable cell
              let nextCol = colIndex + 1;
              while (nextCol < totalCols && tableColumns[nextCol].readOnly)
                nextCol++;
              if (nextCol < totalCols) {
                inputRefs.current[rowIndex][nextCol]?.focus();
              }
            }
            return;
          }
        }

        // Arrow Up / Down moves between rows (skip readOnly columns)
        // Arrow Up / Down moves to previous/next editable column in same row
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

        // Enter moves to next editable cell in the same row
        if (e.key === "Enter") {
          e.preventDefault();
          let nextCol = colIndex + 1;
          while (nextCol < totalCols && tableColumns[nextCol].readOnly)
            nextCol++;
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
              // Last row → optionally add a new row
              addRow();
              setTimeout(() => {
                let firstCol = 0;
                while (firstCol < totalCols && tableColumns[firstCol].readOnly)
                  firstCol++;
                inputRefs.current[rowIndex + 1][firstCol]?.focus();
              }, 50);
            }
          }
        }

        // Tab should just move normally; no dropdown interference
      };

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

              onKeyDown={(e) => handleTableKeyDown(e, rowIndex, colIndex)}          className={`w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-yellow-100 focus:outline-none ${
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
            {formFields
              .slice(0, 3)
              .map((field, index) => renderFormField(field, index))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {formFields
              .slice(3)
              .map((field, index) => renderFormField(field, index + 3))}
          </div>
          <p className="text-sm text-gray-600">
            Press <strong>Enter</strong> to move to next field. Use{" "}
            <strong>Arrow Up/Down</strong> to navigate dropdown options. Press{" "}
            <strong>Enter</strong> to select highlighted option. Date fields
            open calendar on focus - use keyboard to navigate and select dates.
          </p>
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
            <input
              ref={remarksRef}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setShowConfirmModal(true); // ✅ show popup every time Enter is pressed
                }
              }}
              className="flex-1 px-2 py-1 border border-gray-400 rounded text-sm bg-white"
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
      {showConfirmModal && (
        <div
          ref={modalRef}
          className="fixed inset-0 flex items-center justify-center bg-black/50"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              setFocusedButton((prev) => (prev === "yes" ? "cancel" : "yes"));
            }
            if (e.key === "Enter") {
              if (focusedButton === "yes") {
                setShowConfirmModal(false);
                alert("Your order saved successfully!")
                // navigate("/next-page"); // Optional action
              } else {
                setShowConfirmModal(false);
              }
            }
          }}
          tabIndex={-1}
        >
          <div className="bg-white p-4 rounded shadow-lg text-center outline-none">
            <p className="text-sm text-gray-800 mb-3">
              Are you sure you to save this order?
            </p>

            <div className="flex justify-center gap-3">
              <button
                className={`px-3 py-1 rounded ${
                  focusedButton === "cancel"
                    ? "bg-gray-400 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  focusedButton === "yes"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-400"
                }`}
                onClick={() => {
                  setShowConfirmModal(false);
                  // navigate("/next-page");
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
