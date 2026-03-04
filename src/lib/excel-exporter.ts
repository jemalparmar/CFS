// Excel Export Utility

import * as XLSX from "xlsx";
import type { Container, Invoice, Truck, DeliveryOrder } from "./types";

export function exportContainersToExcel(containers: Container[], filename = "containers.xlsx") {
  const data = containers.map(c => ({
    "Container No": c.containerNo,
    "BL No": c.blNo,
    "Size": c.size,
    "Type": c.type,
    "Status": c.status,
    "Yard Location": c.yardLocation,
    "Weight (KG)": c.weight,
    "Shipper": c.shipper,
    "Consignee": c.consignee,
    "Commodity": c.commodity,
    "Port of Loading": c.portOfLoading,
    "Port of Discharge": c.portOfDischarge,
    "Arrival Date": c.arrivalDate,
    "Days in Yard": c.daysInYard,
    "Customs Status": c.customsStatus,
    "Vessel": c.vesselName,
    "Voyage": c.voyageNo,
    "Temperature": c.temperature || "-",
    "Hazmat": c.isHazmat ? "Yes" : "No",
    "IMO Class": c.imoClass || "-",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Containers");
  
  // Auto-size columns
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, 15)
  }));
  ws["!cols"] = colWidths;
  
  XLSX.writeFile(wb, filename);
}

export function exportInvoicesToExcel(invoices: Invoice[], filename = "invoices.xlsx") {
  const data = invoices.map(inv => ({
    "Invoice No": inv.invoiceNo,
    "Date": inv.invoiceDate,
    "Due Date": inv.dueDate,
    "Status": inv.status,
    "Container No": inv.containerNo,
    "BL No": inv.blNo,
    "Bill To": inv.billTo.name,
    "GSTIN": inv.billTo.gstin,
    "Subtotal": inv.subtotal,
    "CGST": inv.cgst,
    "SGST": inv.sgst,
    "IGST": inv.igst,
    "Total": inv.total,
    "Place of Supply": inv.placeOfSupply,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Invoices");
  
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, 12)
  }));
  ws["!cols"] = colWidths;
  
  XLSX.writeFile(wb, filename);
}

export function exportTrucksToExcel(trucks: Truck[], filename = "trucks.xlsx") {
  const data = trucks.map(t => ({
    "Truck No": t.truckNo,
    "Driver Name": t.driverName,
    "Mobile": t.driverMobile,
    "Transporter": t.transporterName,
    "Token No": t.tokenNo,
    "Token Status": t.tokenStatus,
    "Truck Status": t.truckStatus,
    "Purpose": t.purpose,
    "Gate In Time": t.gateInTime || "-",
    "Gate Out Time": t.gateOutTime || "-",
    "Gross Weight": t.weighbridgeWeight || "-",
    "Tare Weight": t.tareWeight || "-",
    "Net Weight": t.netWeight || "-",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Trucks");
  
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, 12)
  }));
  ws["!cols"] = colWidths;
  
  XLSX.writeFile(wb, filename);
}

export function exportDeliveryOrdersToExcel(dos: DeliveryOrder[], filename = "delivery-orders.xlsx") {
  const data = dos.map(d => ({
    "DO No": d.doNo,
    "DO Date": d.doDate,
    "Valid Until": d.validUntil,
    "Status": d.status,
    "Type": d.doType,
    "Container No": d.containerNo,
    "BL No": d.blNo,
    "BE No": d.beNo,
    "Consignee": d.consigneeName,
    "GSTIN": d.consigneeGSTIN,
    "CHA Name": d.chaName,
    "Shipping Line": d.shippingLine,
    "Commodity": d.commodity,
    "Container Size": d.containerSize,
    "Gross Weight": d.grossWeight,
    "Packages": d.packages,
    "Vessel": d.vesselName,
    "Voyage": d.voyageNo,
    "Duty Paid": d.dutyPaid ? "Yes" : "No",
    "Demurrage Cleared": d.demurrageCleared ? "Yes" : "No",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Delivery Orders");
  
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, 12)
  }));
  ws["!cols"] = colWidths;
  
  XLSX.writeFile(wb, filename);
}

// Generate summary report
export function generateSummaryReport(
  containers: Container[],
  invoices: Invoice[],
  trucks: Truck[],
  filename = "summary-report.xlsx"
) {
  const wb = XLSX.utils.book_new();
  
  // Container Summary
  const containerSummary = [
    ["Container Summary"],
    ["Total Containers", containers.length],
    ["By Status"],
    ...Object.entries(containers.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([status, count]) => [status, count]),
    ["By Type"],
    ...Object.entries(containers.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([type, count]) => [type, count]),
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(containerSummary);
  XLSX.utils.book_append_sheet(wb, ws1, "Container Summary");
  
  // Invoice Summary
  const totalInvoiceValue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === "PAID").reduce((sum, inv) => sum + inv.total, 0);
  const pendingInvoices = invoices.filter(inv => inv.status !== "PAID").reduce((sum, inv) => sum + inv.total, 0);
  
  const invoiceSummary = [
    ["Invoice Summary"],
    ["Total Invoices", invoices.length],
    ["Total Value", `₹${totalInvoiceValue.toFixed(2)}`],
    ["Paid Value", `₹${paidInvoices.toFixed(2)}`],
    ["Pending Value", `₹${pendingInvoices.toFixed(2)}`],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(invoiceSummary);
  XLSX.utils.book_append_sheet(wb, ws2, "Invoice Summary");
  
  // Truck Summary
  const truckSummary = [
    ["Truck Summary"],
    ["Total Trucks", trucks.length],
    ["By Status"],
    ...Object.entries(trucks.reduce((acc, t) => {
      acc[t.truckStatus] = (acc[t.truckStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([status, count]) => [status, count]),
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(truckSummary);
  XLSX.utils.book_append_sheet(wb, ws3, "Truck Summary");
  
  XLSX.writeFile(wb, filename);
}
