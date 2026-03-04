"use client";

import { TopBar } from "@/components/layout/TopBar";
import { mockInvoices } from "@/lib/mock-data";
import { useState } from "react";
import { getInvoiceStatusBadge } from "@/components/ui/Badge";
import {
  FileText,
  Plus,
  Printer,
  Download,
  Search,
  X,
  Building,
  IndianRupee,
  Calendar,
  CheckCircle,
} from "lucide-react";
import type { Invoice } from "@/lib/types";

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPrint, setShowPrint] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = mockInvoices.filter((inv) => {
    const matchSearch =
      !search ||
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.containerNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.billTo.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalAmount = mockInvoices.reduce((s, i) => s + i.total, 0);
  const paidAmount = mockInvoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0);
  const pendingAmount = mockInvoices.filter((i) => i.status === "ISSUED").reduce((s, i) => s + i.total, 0);

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title="TAX Invoice" subtitle="GST Invoicing & Billing Management" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Invoices", value: mockInvoices.length, color: "text-blue-400" },
            { label: "Total Amount (₹)", value: `₹${(totalAmount / 1000).toFixed(1)}K`, color: "text-emerald-400" },
            { label: "Pending (₹)", value: `₹${(pendingAmount / 1000).toFixed(1)}K`, color: "text-amber-400" },
            { label: "Overdue", value: mockInvoices.filter((i) => i.status === "OVERDUE").length, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Invoice List */}
          <div className="xl:col-span-1 space-y-4">
            {/* Filters */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search invoice, container..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {["ALL", "DRAFT", "ISSUED", "PAID", "OVERDUE"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      statusFilter === s ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                <Plus size={14} />
                Create Invoice
              </button>
            </div>

            {/* Invoice Cards */}
            <div className="space-y-3">
              {filtered.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`bg-slate-900 border rounded-xl p-4 cursor-pointer transition-all hover:border-slate-600 ${
                    selectedInvoice?.id === inv.id ? "border-blue-600 ring-1 ring-blue-500/50" : "border-slate-700/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-mono text-blue-300 text-sm font-bold">{inv.invoiceNo}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{inv.invoiceDate}</div>
                    </div>
                    {getInvoiceStatusBadge(inv.status)}
                  </div>
                  <div className="text-slate-300 text-xs mb-1 truncate">{inv.billTo.name}</div>
                  <div className="text-slate-500 text-xs font-mono">{inv.containerNo}</div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-emerald-400 font-bold text-sm">
                      ₹{inv.total.toLocaleString("en-IN")}
                    </span>
                    <span className="text-slate-500 text-xs">Due: {inv.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="xl:col-span-2">
            {selectedInvoice ? (
              <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                  <h3 className="text-white font-semibold">Invoice Preview</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPrint(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                    >
                      <Printer size={12} />
                      Print
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg hover:bg-slate-700">
                      <Download size={12} />
                      PDF
                    </button>
                  </div>
                </div>

                {/* Invoice Content */}
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-white font-bold text-xl">{selectedInvoice.billFrom.name}</div>
                      <div className="text-slate-400 text-xs mt-1 max-w-xs">{selectedInvoice.billFrom.address}</div>
                      <div className="text-slate-500 text-xs mt-1">GSTIN: {selectedInvoice.billFrom.gstin}</div>
                      <div className="text-slate-500 text-xs">PAN: {selectedInvoice.billFrom.pan}</div>
                      <div className="text-slate-500 text-xs">CIN: {selectedInvoice.billFrom.cin}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">TAX INVOICE</div>
                      <div className="text-slate-300 font-mono text-sm mt-1">{selectedInvoice.invoiceNo}</div>
                      <div className="text-slate-400 text-xs mt-1">Date: {selectedInvoice.invoiceDate}</div>
                      <div className="text-slate-400 text-xs">Due: {selectedInvoice.dueDate}</div>
                      <div className="mt-2">{getInvoiceStatusBadge(selectedInvoice.status)}</div>
                    </div>
                  </div>

                  {/* Bill To */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-slate-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Building size={10} /> Bill To
                      </div>
                      <div className="text-white font-semibold text-sm">{selectedInvoice.billTo.name}</div>
                      <div className="text-slate-400 text-xs mt-1">{selectedInvoice.billTo.address}</div>
                      <div className="text-slate-500 text-xs mt-1">GSTIN: {selectedInvoice.billTo.gstin}</div>
                      <div className="text-slate-500 text-xs">PAN: {selectedInvoice.billTo.pan}</div>
                      <div className="text-slate-500 text-xs">{selectedInvoice.billTo.email}</div>
                      <div className="text-slate-500 text-xs">{selectedInvoice.billTo.phone}</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Shipment Details</div>
                      <div className="space-y-1.5">
                        {[
                          ["Container No", selectedInvoice.containerNo],
                          ["BL No", selectedInvoice.blNo],
                          ["Place of Supply", selectedInvoice.placeOfSupply],
                          ["SAC Code", selectedInvoice.sacCode],
                          ["Currency", selectedInvoice.currency],
                          ["Payment Terms", selectedInvoice.paymentTerms],
                        ].map(([l, v]) => (
                          <div key={l} className="flex justify-between text-xs">
                            <span className="text-slate-500">{l}:</span>
                            <span className="text-slate-300 font-medium font-mono">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-3">Services</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-slate-800 border border-slate-700">
                            <th className="text-left text-slate-400 px-3 py-2">Description</th>
                            <th className="text-left text-slate-400 px-3 py-2">SAC</th>
                            <th className="text-right text-slate-400 px-3 py-2">Qty</th>
                            <th className="text-right text-slate-400 px-3 py-2">Rate</th>
                            <th className="text-right text-slate-400 px-3 py-2">Amount</th>
                            <th className="text-right text-slate-400 px-3 py-2">CGST</th>
                            <th className="text-right text-slate-400 px-3 py-2">SGST</th>
                            <th className="text-right text-slate-400 px-3 py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items.map((item) => (
                            <tr key={item.id} className="border-b border-slate-800">
                              <td className="px-3 py-2.5 text-slate-300">{item.description}</td>
                              <td className="px-3 py-2.5 text-slate-500 font-mono">{item.sacCode}</td>
                              <td className="px-3 py-2.5 text-slate-300 text-right">{item.quantity} {item.unit}</td>
                              <td className="px-3 py-2.5 text-slate-300 text-right">₹{item.rate.toLocaleString("en-IN")}</td>
                              <td className="px-3 py-2.5 text-slate-300 text-right">₹{item.amount.toLocaleString("en-IN")}</td>
                              <td className="px-3 py-2.5 text-slate-400 text-right">
                                {item.cgstRate}% = ₹{item.cgstAmount.toLocaleString("en-IN")}
                              </td>
                              <td className="px-3 py-2.5 text-slate-400 text-right">
                                {item.sgstRate}% = ₹{item.sgstAmount.toLocaleString("en-IN")}
                              </td>
                              <td className="px-3 py-2.5 text-emerald-400 font-bold text-right">
                                ₹{item.totalAmount.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-72 space-y-2">
                      {[
                        ["Subtotal", selectedInvoice.subtotal],
                        ["CGST (9%)", selectedInvoice.cgst],
                        ["SGST (9%)", selectedInvoice.sgst],
                        ...(selectedInvoice.igst > 0 ? [["IGST (18%)", selectedInvoice.igst]] : []),
                      ].map(([l, v]) => (
                        <div key={String(l)} className="flex justify-between text-sm">
                          <span className="text-slate-400">{l}</span>
                          <span className="text-slate-300">₹{Number(v).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                      <div className="border-t border-slate-700 pt-2 flex justify-between">
                        <span className="text-white font-bold">Total Amount</span>
                        <span className="text-emerald-400 font-bold text-lg">
                          ₹{selectedInvoice.total.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Bank Details</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        ["Bank", selectedInvoice.bankDetails.bankName],
                        ["Account No", selectedInvoice.bankDetails.accountNo],
                        ["IFSC", selectedInvoice.bankDetails.ifsc],
                        ["Branch", selectedInvoice.bankDetails.branch],
                      ].map(([l, v]) => (
                        <div key={l} className="flex gap-2">
                          <span className="text-slate-500">{l}:</span>
                          <span className="text-slate-300 font-mono">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedInvoice.status === "ISSUED" && (
                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 text-white text-sm rounded-lg hover:bg-emerald-600">
                        <CheckCircle size={14} />
                        Mark as Paid
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-700">
                        <Calendar size={14} />
                        Send Reminder
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-700/50 rounded-xl h-96 flex flex-col items-center justify-center">
                <FileText className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-slate-500 text-sm">Select an invoice to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
