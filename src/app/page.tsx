"use client";
import { useState, useRef } from "react";
import { Header } from "@/components/features/Header";
import { OrderForm } from "@/components/features/OrderForm";
import { ProductTable } from "@/components/features/ProductTable";
import { ActionBar } from "@/components/features/ActionBar";
import { Modal } from "@/components/ui/Modal";
import { ErrorModal } from "@/components/ui/ErrorModal";
import { InputModal } from "@/components/ui/InputModal";
import { useProductTable } from "@/hooks/useProductTable";
import { useProductsAndCustomers } from "@/hooks/useProductsAndCustomers";
import { saveOrder, fetchOrder } from "./api/orders/client";
import { OrderData, OrderDetailItem, Row, OrderHead } from "@/types";

export default function Home() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOrderInputModal, setShowOrderInputModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  
  // Load products and customers from database
  const { products, customers } = useProductsAndCustomers();
  
  // Order Form State
  const [formData, setFormData] = useState({
    orderNo: "",
    customer: "",
    poNo: "",
    measurement: "INCH",
  });
  
  const [dates, setDates] = useState<{
    orderDate: Date | null;
    poDate: Date | null;
    dueDate: Date | null;
  }>({
    orderDate: null,
    poDate: null,
    dueDate: null,
  });

  const [remarks, setRemarks] = useState("");
  const remarksRef = useRef<HTMLInputElement>(null);
  const measurementRef = useRef<HTMLInputElement>(null);

  // Table State Hook - pass dynamic products
  const tableState = useProductTable(products);

  const handleFocusProductTable = () => {
    // Focus first row, product column (index 1 based on tableColumns)
    if (tableState.inputRefs.current[0] && tableState.inputRefs.current[0][1]) {
      tableState.inputRefs.current[0][1]?.focus();
    }
  };

  const handleFocusOrderForm = () => {
    if (measurementRef.current) {
      measurementRef.current.focus();
    }
  };

  const handleFocusRemarks = () => {
      if (remarksRef.current) {
          remarksRef.current.focus();
      }
  };


  const handleSave = () => {
    console.log("=== VALIDATION START ===");
    console.log("Form Data:", formData);
    console.log("Dates:", dates);
    console.log("Table Rows:", tableState.rows);
    
    // Validation: Check all required fields
    const missingFields: string[] = [];

    // Check form fields (excluding orderNo)
    if (!formData.customer || formData.customer.trim() === "") {
      missingFields.push("Customer");
    }
    if (!formData.poNo || formData.poNo.trim() === "") {
      missingFields.push("PO No");
    }
    if (!formData.measurement || formData.measurement.trim() === "") {
      missingFields.push("Measurement");
    }

    // Check dates
    if (!dates.orderDate) {
      missingFields.push("Order Date");
    }
    if (!dates.poDate) {
      missingFields.push("PO Date");
    }
    if (!dates.dueDate) {
      missingFields.push("Due Date");
    }

    // Check if at least one product is filled
    const hasProducts = tableState.rows.some(row => row.product && row.product.trim() !== "");
    if (!hasProducts) {
      missingFields.push("At least one Product");
    }

    console.log("Missing Fields:", missingFields);

    // If there are missing fields, show validation modal
    if (missingFields.length > 0) {
      const message = `You missed some required fields:\n\n${missingFields.join("\n")}\n\nPlease fill all required fields before saving.`;
      console.log("Showing validation modal with message:", message);
      setValidationMessage(message);
      setShowValidationModal(true);
      return;
    }

    console.log("=== VALIDATION PASSED ===");
    // All validations passed, show confirmation modal
    setShowConfirmModal(true);
  };

  const handleNew = () => {
      // Reset Form Data
      setFormData({
          orderNo: "",
          customer: "",
          poNo: "",
          measurement: "INCH",
      });

      // Reset Dates
      setDates({
          orderDate: null,
          poDate: null,
          dueDate: null,
      });

      // Reset Remarks
      setRemarks("");

      // Reset Table Rows
      // We need to recreate the initial empty rows structure
      const initialRows = Array.from({ length: 7 }, (_, i) => ({
          sno: i + 1,
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
      }));
      // Cast to Row[] if needed, but the structure matches
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tableState.setRows(initialRows as any);
      
      // Also reset product selection state if exposed, but useProductTable handles internal state mostly.
      // Ideally useProductTable should expose a reset function, but setRows works for data.
      // We might need to reset productNotSelected array too if we want to clear red highlights.
      if (tableState.setProductNotSelected) {
          tableState.setProductNotSelected(Array(7).fill(null));
      }
  };

  const handleOpen = () => {
      setShowOrderInputModal(true);
  };

  const handleOrderNumberSubmit = async (orderNumber: string) => {
      setShowOrderInputModal(false);
      
      try {
          const orderNo = parseInt(orderNumber, 10);
          if (isNaN(orderNo)) {
              alert("Please enter a valid order number");
              return;
          }
          
          const data: OrderData = await fetchOrder(orderNo);
          
          if (data && data.OrderHead) {
              const head = data.OrderHead;
              
              // Parse Date: handles both "DD-MM-YYYY" and "MM/DD/YYYY" formats
              const parseDate = (dateStr: string | undefined) => {
                  if (!dateStr) return null;
                  
                  // Check if it's MM/DD/YYYY format (contains /)
                  if (dateStr.includes('/')) {
                      const parts = dateStr.split('/');
                      if (parts.length === 3) {
                          // MM/DD/YYYY -> YYYY-MM-DD
                          return new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
                      }
                  } else if (dateStr.includes('-')) {
                      // DD-MM-YYYY format
                      const parts = dateStr.split('-');
                      if (parts.length === 3) {
                          // DD-MM-YYYY -> YYYY-MM-DD
                          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                      }
                  }
                  return null;
              };

              setFormData({
                  orderNo: head.OrderNo,
                  customer: head.CustomerName,
                  poNo: head.PartyOrderNo,
                  measurement: head.Measurement,
              });
              
              setDates({
                  orderDate: parseDate(head.OrderDate),
                  poDate: parseDate(head.PartyOrderDate) || new Date(), // Fallback if missing
                  dueDate: parseDate(head.DueDate) || new Date(), // Parse DueDate from API
              });
              
              setRemarks(head.Remarks);
              
              if (data.OrderDetail && data.OrderDetail.length > 0) {
                  const newRows: Row[] = data.OrderDetail.map((item: OrderDetailItem) => ({
                      sno: item.Sno,
                      autoIncrement: item.AutoIncrement,
                      product: item.ProductName,
                      width: item.Width,
                      length: item.Length,
                      flop: item.Flop,
                      gauge: item.Gauge.toString(),
                      remarks: item.Remarks,
                      pieces: item.OrderPiece.toString(),
                      weight: item.OrderWeight,
                      reqWgt: item.RequiredWeight,
                      rateFor: item.RateFor === "PIECE" ? "Piece" : "Weight", // Normalize case
                      rate: item.Rate
                  }));
                  
                  // Fill remaining rows to keep table look if less than 7
                  while (newRows.length < 7) {
                      newRows.push({
                          sno: newRows.length + 1,
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
                          rate: ""
                      });
                  }
                  
                  tableState.setRows(newRows);
              }
          }
      } catch (error) {
          console.error("Failed to load order", error);
          alert("Failed to load order. Please check the order number and try again.");
      }
  };

  const onConfirmSave = async () => {
    setShowConfirmModal(false);
    
    // Safety validation - should not reach here if handleSave validation works
    // But adding as extra protection
    const missingFields: string[] = [];
    
    if (!formData.customer || formData.customer.trim() === "") {
      missingFields.push("Customer");
    }
    if (!formData.poNo || formData.poNo.trim() === "") {
      missingFields.push("PO No");
    }
    if (!formData.measurement || formData.measurement.trim() === "") {
      missingFields.push("Measurement");
    }
    if (!dates.orderDate) {
      missingFields.push("Order Date");
    }
    if (!dates.poDate) {
      missingFields.push("PO Date");
    }
    if (!dates.dueDate) {
      missingFields.push("Due Date");
    }
    
    const hasProducts = tableState.rows.some(row => row.product && row.product.trim() !== "");
    if (!hasProducts) {
      missingFields.push("At least one Product");
    }
    
    if (missingFields.length > 0) {
      console.error("CRITICAL: Validation bypassed! Missing fields:", missingFields);
      const message = `You missed some required fields:\n\n${missingFields.join("\n")}\n\nPlease fill all required fields before saving.`;
      setValidationMessage(message);
      setShowValidationModal(true);
      return;
    }
    
    try {
      // Format dates to MM/DD/YYYY (backend expects this format)
      const formatDateToAPI = (date: Date | null): string => {
        if (!date) return "";
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };

      // Calculate totals
      const totalPieces = tableState.rows.reduce((sum, r) => sum + (parseFloat(r.pieces) || 0), 0);
      const totalWeight = tableState.rows.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0);

      // Prepare OrderHead (note: DueDate is optional)
      const orderHead: OrderHead = {
        OrderNo: formData.orderNo || "NEW",
        OrderDate: formatDateToAPI(dates.orderDate),
        CustomerName: formData.customer || "",
        CustomerMobileNo: "",
        PartyOrderNo: formData.poNo || "",
        PartyOrderDate: dates.poDate ? formatDateToAPI(dates.poDate) : "",
        Measurement: formData.measurement || "INCH",
        Remarks: remarks || "",
        TotalOrderPiece: totalPieces,
        TotalOrderWeight: totalWeight.toFixed(3),
        JobStatus: "Pending",
        ModuleEntryCode: "TRANS-ORDER",
        CompanyId: 1,
        FinancialPeriod: "25-26",
        UserId_UserHead: 15,
      };
      
      // Add DueDate only if it exists
      if (dates.dueDate) {
        orderHead.DueDate = formatDateToAPI(dates.dueDate);
      }

      // Prepare OrderDetail - only include rows with product
      const orderDetail = tableState.rows
        .filter(row => row.product.trim() !== "")
        .map((row, index) => {
          // Generate AutoIncrement for new items: "new_{index}_{timestamp}"
          // AutoIncrement should be a number. For new items, we can send 0 or any number
          // as the backend ignores it for insertions (it uses insertId).
          // Existing items will have their original AutoIncrement number.
          const autoInc = row.autoIncrement ? row.autoIncrement : 0;
          
          return {
            Sno: index + 1,
            AutoIncrement: autoInc,
            ProductName: row.product,
            Width: row.width || "0",
            Length: row.length || "0",
            Flop: row.flop || "0",
            Gauge: parseFloat(row.gauge || "0"),
            NoOfBackColors: "",
            NoOfFrontColors: "",
            Remarks: row.remarks || "",
            OrderPiece: parseFloat(row.pieces || "0"),
            OrderWeight: row.weight || "0.000",
            RequiredWeight: "0",
            RateFor: row.rateFor.toUpperCase(),
            Rate: row.rate || "0",
          };
        });

      const orderData = {
        OrderHead: orderHead,
        OrderDetail: orderDetail,
      };

      // Determine if this is an update (existing order) or new order
      const isUpdate = !!(formData.orderNo && String(formData.orderNo).trim() !== "");

      console.log(isUpdate ? "Updating order:" : "Saving new order:", orderData);
      const result = await saveOrder(orderData, isUpdate);
      
      console.log("API Response:", result);
      
      // Handle different response formats
      if (result && result.Status === "Success") {
        alert(isUpdate ? "Your order updated successfully!" : "Your order saved successfully!");
      } else if (Array.isArray(result) && result.length === 0) {
        // Empty array might indicate success in some APIs
        alert(isUpdate ? "Your order updated successfully!" : "Your order saved successfully!");
      } else if (result && result.Status) {
        alert(`Order operation completed with status: ${result.Status}`);
      } else {
        console.warn("Unexpected response format:", result);
        alert("Order operation completed, but response format is unexpected. Please verify the order was saved.");
      }
    } catch (error) {
      console.error("Failed to save order:", error);
      alert("Failed to save order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 p-4 font-sans">
      <div className="max-w-7xl mx-auto shadow-2xl rounded-lg overflow-hidden">
        <Header />
        
        <OrderForm 
            formData={formData} 
            setFormData={setFormData} 
            dates={dates} 
            setDates={setDates}
            customers={customers}
            onFocusNext={handleFocusProductTable}
            measurementRef={measurementRef}
        />

        <ProductTable 
            tableState={tableState} 
            onFocusPrevious={handleFocusOrderForm}
            onFocusRemarks={handleFocusRemarks}
        />

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
                  setShowConfirmModal(true);
                }
              }}
              className="flex-1 px-2 py-1 border border-gray-400 rounded text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter remarks here..."
            />
          </div>
          <div className="text-right mt-2 text-xs text-blue-800">
            Entered By <span className="font-semibold">ADMIN</span> @ 05/08/2025
            10:30AM
          </div>
        </div>

        <ActionBar onSave={handleSave} onOpen={handleOpen} onNew={handleNew} />
        {/* Hidden button to trigger load for testing/demo if needed, or bind to Open in ActionBar */}
        <button onClick={handleOpen} className="hidden" id="load-btn">Load</button>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={onConfirmSave}
        message="Are you sure you want to save this order?"
      />
      
      <ErrorModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title="Required Fields Missing"
        message={validationMessage}
      />
      
      <InputModal
        isOpen={showOrderInputModal}
        onClose={() => setShowOrderInputModal(false)}
        onConfirm={handleOrderNumberSubmit}
        title="Open Order"
        message="Enter the order number to load"
        placeholder="e.g., 1"
        inputLabel="Order Number"
      />
    </div>
  );
}
