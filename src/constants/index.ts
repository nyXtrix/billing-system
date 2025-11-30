import { FormField, TableColumn } from "@/types";

// Note: Product and customer options are now loaded dynamically from the database
// See useProductsAndCustomers hook for dynamic data loading

export const measurementOptions = ["CM", "INCH"];
export const rateForOptions = ["Piece", "Weight"];

export const formFields: FormField[] = [
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
    // options loaded dynamically from database
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

export const tableColumns: TableColumn[] = [
  { key: "sno", header: "SNO", width: "w-12", readOnly: true },
  {
    key: "product",
    header: "PRODUCT",
    width: "w-48",
    type: "dropdown",
    // options loaded dynamically from database
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

export const buttons = [
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
