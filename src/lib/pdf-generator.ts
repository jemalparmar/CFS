// PDF Invoice Generator Utility

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice } from "./types";

export function generateInvoicePDF(invoice: Invoice): jsPDF {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("TAX INVOICE", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.text("GSTIN: 27AABCT1234C1ZZ", 14, 30);
  doc.text("CFS Nhava Sheva Terminal", 14, 35);
  doc.text("Jawaharlal Nehru Port Trust", 14, 40);
  doc.text("Navi Mumbai - 400707", 14, 45);
  
  // Invoice Details
  doc.setFontSize(11);
  doc.text(`Invoice No: ${invoice.invoiceNo}`, 140, 30);
  doc.text(`Date: ${invoice.invoiceDate}`, 140, 35);
  doc.text(`Due Date: ${invoice.dueDate}`, 140, 40);
  doc.text(`Status: ${invoice.status}`, 140, 45);
  
  // Bill To / Bill From
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("BILL FROM:", 14, 55);
  doc.text("BILL TO:", 120, 55);
  
  doc.setTextColor(40, 40, 40);
  doc.text(invoice.billFrom.name, 14, 62);
  doc.text(invoice.billTo.name, 120, 62);
  
  doc.setFontSize(9);
  doc.text(invoice.billFrom.address, 14, 67);
  doc.text(invoice.billTo.address, 120, 67);
  doc.text(`GSTIN: ${invoice.billFrom.gstin}`, 14, 72);
  doc.text(`GSTIN: ${invoice.billTo.gstin}`, 120, 72);
  doc.text(`PAN: ${invoice.billFrom.pan}`, 14, 77);
  doc.text(`PAN: ${invoice.billTo.pan}`, 120, 77);
  
  // Container Info
  doc.text(`Container No: ${invoice.containerNo}`, 14, 85);
  doc.text(`BL No: ${invoice.blNo}`, 80, 85);
  doc.text(`SAC Code: ${invoice.sacCode}`, 14, 90);
  doc.text(`Place of Supply: ${invoice.placeOfSupply}`, 80, 90);
  
  // Items Table
  const tableData = invoice.items.map(item => [
    item.description,
    item.sacCode,
    item.quantity.toString(),
    item.unit,
    `₹${item.rate.toFixed(2)}`,
    `₹${item.amount.toFixed(2)}`,
    item.cgstRate > 0 ? `${item.cgstRate}%` : "-",
    `₹${item.cgstAmount.toFixed(2)}`,
    `₹${item.totalAmount.toFixed(2)}`
  ]);
  
  autoTable(doc, {
    startY: 95,
    head: [['Description', 'SAC', 'Qty', 'Unit', 'Rate', 'Amount', 'CGST', 'CGST Amt', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 8 },
  });
  
  // Summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.text("Summary:", 140, finalY);
  doc.text(`Subtotal: ₹${invoice.subtotal.toFixed(2)}`, 140, finalY + 6);
  
  if (invoice.cgst > 0) {
    doc.text(`CGST (9%): ₹${invoice.cgst.toFixed(2)}`, 140, finalY + 11);
  }
  if (invoice.sgst > 0) {
    doc.text(`SGST (9%): ₹${invoice.sgst.toFixed(2)}`, 140, finalY + 16);
  }
  if (invoice.igst > 0) {
    doc.text(`IGST (18%): ₹${invoice.igst.toFixed(2)}`, 140, finalY + 16);
  }
  
  doc.setFontSize(12);
  doc.setTextColor(41, 128, 185);
  doc.text(`Total: ₹${invoice.total.toFixed(2)}`, 140, finalY + 24);
  
  // Bank Details
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text("Bank Details:", 14, finalY);
  doc.setFontSize(9);
  doc.text(`Bank: ${invoice.bankDetails.bankName}`, 14, finalY + 6);
  doc.text(`A/c: ${invoice.bankDetails.accountNo}`, 14, finalY + 11);
  doc.text(`IFSC: ${invoice.bankDetails.ifsc}`, 14, finalY + 16);
  doc.text(`Branch: ${invoice.bankDetails.branch}`, 14, finalY + 21);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("This is a computer-generated invoice.", 105, 280, { align: "center" });
  doc.text("Thank you for your business!", 105, 285, { align: "center" });
  
  return doc;
}

export function downloadInvoicePDF(invoice: Invoice) {
  const doc = generateInvoicePDF(invoice);
  doc.save(`invoice-${invoice.invoiceNo}.pdf`);
}
