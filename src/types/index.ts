export type Row = {
  sno: number;
  autoIncrement?: number;
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

export type FormField = {
  label: string;
  key: string;
  type: "text" | "date" | "dropdown";
  width: string;
  grid: string;
  options?: string[];
};

export interface OrderHead {
  OrderNo: string;
  OrderDate: string;
  CustomerName: string;
  CustomerMobileNo?: string;
  PartyOrderNo: string;
  PartyOrderDate?: string;
  DueDate?: string;
  Measurement: string;
  Remarks: string;
  TotalOrderPiece: number;
  TotalOrderWeight: string;
  JobStatus: string;
  ModuleEntryCode?: string;
  CompanyId?: number;
  FinancialPeriod?: string;
  UserId_UserHead?: number;
}

export interface OrderDetailItem {
  AutoIncrement: number;
  Sno: number;
  ProductName: string;
  Width: string;
  Length: string;
  Flop: string;
  Gauge: number;
  Remarks: string;
  OrderPiece: number;
  OrderWeight: string;
  RateFor: string;
  Rate: string;
  RequiredWeight: string;
}

export interface OrderData {
  OrderHead: OrderHead;
  OrderDetail: OrderDetailItem[];
}

export type TableColumn = {
  key: string;
  header: string;
  width: string;
  type?: "text" | "select" | "dropdown";
  readOnly?: boolean;
  align?: string;
  options?: string[];
};
