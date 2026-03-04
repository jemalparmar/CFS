// CFS Terminal Operating System - Type Definitions

export type ContainerStatus =
  | "ARRIVED"
  | "IN_YARD"
  | "CUSTOMS_HOLD"
  | "CLEARED"
  | "DELIVERED"
  | "STUFFING"
  | "DESTUFFING";

export type ContainerSize = "20FT" | "40FT" | "40HC" | "45FT";
export type ContainerType = "DRY" | "REEFER" | "HAZMAT" | "OOG" | "TANK";

export type TruckStatus = "PENDING" | "GATE_IN" | "LOADING" | "GATE_OUT" | "CANCELLED";
export type TokenStatus = "ISSUED" | "ACTIVE" | "COMPLETED" | "EXPIRED";

export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "CANCELLED";
export type GateType = "IMPORT" | "EXPORT";
export type GateStatus = "OPEN" | "CLOSED" | "MAINTENANCE";

export interface Container {
  id: string;
  containerNo: string;
  blNo: string;
  size: ContainerSize;
  type: ContainerType;
  status: ContainerStatus;
  yardLocation: string;
  row: number;
  bay: number;
  tier: number;
  weight: number;
  tare: number;
  grossWeight: number;
  shipper: string;
  consignee: string;
  commodity: string;
  portOfLoading: string;
  portOfDischarge: string;
  arrivalDate: string;
  freeTime: number;
  daysInYard: number;
  customsStatus: string;
  iceGateRef?: string;
  beNo?: string;
  igmNo?: string;
  lineNo?: string;
  vesselName: string;
  voyageNo: string;
  sealNo: string;
  temperature?: number;
  isHazmat: boolean;
  imoClass?: string;
  unNo?: string;
}

export interface YardBlock {
  id: string;
  name: string;
  rows: number;
  bays: number;
  tiers: number;
  type: "IMPORT" | "EXPORT" | "EMPTY" | "REEFER" | "HAZMAT";
  capacity: number;
  occupied: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface YardSlot {
  blockId: string;
  row: number;
  bay: number;
  tier: number;
  containerId?: string;
  containerNo?: string;
  status: "EMPTY" | "OCCUPIED" | "RESERVED" | "DAMAGED";
}

export interface Truck {
  id: string;
  truckNo: string;
  driverName: string;
  driverLicense: string;
  driverMobile: string;
  transporterName: string;
  transporterCode: string;
  tokenNo: string;
  tokenStatus: TokenStatus;
  truckStatus: TruckStatus;
  gateInTime?: string;
  gateOutTime?: string;
  assignedContainers: string[];
  weighbridgeWeight?: number;
  tareWeight?: number;
  netWeight?: number;
  appointmentTime?: string;
  purpose: "DELIVERY" | "PICKUP" | "STUFFING" | "DESTUFFING";
}

export interface TruckToken {
  id: string;
  tokenNo: string;
  truckNo: string;
  driverName: string;
  transporterName: string;
  issuedAt: string;
  validUntil: string;
  status: TokenStatus;
  purpose: string;
  containerNos: string[];
  qrCode: string;
  gateAssigned?: string;
}

export interface GateEntry {
  id: string;
  gateNo: string;
  gateType: GateType;
  truckNo: string;
  tokenNo: string;
  driverName: string;
  entryTime: string;
  exitTime?: string;
  containerNos: string[];
  status: "IN" | "OUT" | "PENDING";
  operatorId: string;
  remarks?: string;
  qrScanned: boolean;
  weighbridgeSlip?: string;
}

export interface WeighbridgeRecord {
  id: string;
  slipNo: string;
  truckNo: string;
  driverName: string;
  grossWeight: number;
  tare: number;
  netWeight: number;
  weighedAt: string;
  operatorId: string;
  containerNo?: string;
  purpose: string;
  vehicleType: string;
  remarks?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  billTo: {
    name: string;
    address: string;
    gstin: string;
    pan: string;
    email: string;
    phone: string;
  };
  billFrom: {
    name: string;
    address: string;
    gstin: string;
    pan: string;
    cin: string;
  };
  containerNo: string;
  blNo: string;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  sacCode: string;
  placeOfSupply: string;
  currency: string;
  paymentTerms: string;
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifsc: string;
    branch: string;
  };
}

export interface InvoiceItem {
  id: string;
  description: string;
  sacCode: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
}

export interface IceGateEntry {
  id: string;
  beNo: string;
  beDate: string;
  igmNo: string;
  igmDate: string;
  lineNo: string;
  containerNo: string;
  blNo: string;
  importerName: string;
  importerIEC: string;
  importerGSTIN: string;
  customsStation: string;
  assessedValue: number;
  dutyAmount: number;
  status: "FILED" | "ASSESSED" | "OOC" | "HOLD" | "EXAMINATION";
  examOrder?: string;
  oocDate?: string;
  chaName: string;
  chaCode: string;
  commodity: string;
  hsCode: string;
  quantity: number;
  unit: string;
  currency: string;
  cif: number;
  exchangeRate: number;
  remarks?: string;
}

export type DeliveryOrderStatus = "PENDING" | "APPROVED" | "RELEASED" | "EXPIRED" | "CANCELLED";
export type DOType = "IMPORT" | "EXPORT";

export interface DeliveryOrder {
  id: string;
  doNo: string;
  doDate: string;
  validUntil: string;
  status: DeliveryOrderStatus;
  doType: DOType;
  containerNo: string;
  blNo: string;
  beNo: string;
  igmNo: string;
  lineNo: string;
  consigneeName: string;
  consigneeGSTIN: string;
  consigneeAddress: string;
  consigneeContact: string;
  chaName: string;
  chaCode: string;
  chaContact: string;
  shippingLine: string;
  shippingLineRef: string;
  commodity: string;
  containerSize: ContainerSize;
  containerType: ContainerType;
  grossWeight: number;
  packages: number;
  packageUnit: string;
  yardLocation: string;
  vesselName: string;
  voyageNo: string;
  portOfLoading: string;
  customsOOCDate?: string;
  dutyPaid: boolean;
  dutyAmount?: number;
  demurrageCleared: boolean;
  demurrageAmount?: number;
  approvedBy?: string;
  approvedAt?: string;
  releasedBy?: string;
  releasedAt?: string;
  truckNo?: string;
  tokenNo?: string;
  remarks?: string;
  documents: DODocument[];
}

export interface DODocument {
  id: string;
  docType: "BL_COPY" | "BE_COPY" | "OOC_CERT" | "DUTY_RECEIPT" | "ID_PROOF" | "AUTH_LETTER" | "OTHER";
  docNo: string;
  uploadedAt: string;
  verified: boolean;
  verifiedBy?: string;
}

export interface DashboardStats {
  totalContainers: number;
  containersInYard: number;
  containersCleared: number;
  containersOnHold: number;
  trucksToday: number;
  gateInToday: number;
  gateOutToday: number;
  pendingInvoices: number;
  yardOccupancy: number;
  reeferCount: number;
  hazmatCount: number;
  overdueContainers: number;
}
