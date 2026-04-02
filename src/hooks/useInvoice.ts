import { useState, useCallback } from "react";
import type { InvoiceData, LineItem } from "@/types/invoice";

const currentInvoiceNumber = (): string => {
  const stored = localStorage.getItem("pix-invoice-counter");
  const counter = stored ? parseInt(stored, 10) : 1;
  return `PIX-${counter.toString().padStart(4, "0")}`;
};

const nextInvoiceNumber = (): string => {
  const stored = localStorage.getItem("pix-invoice-counter");
  const counter = stored ? parseInt(stored, 10) + 1 : 1;
  localStorage.setItem("pix-invoice-counter", counter.toString());
  return `PIX-${counter.toString().padStart(4, "0")}`;
};

const today = () => new Date().toISOString().split("T")[0];
const in30Days = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
};

const emptyItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  amount: 0,
});

export function useInvoice() {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: currentInvoiceNumber(),
    date: today(),
    dueDate: in30Days(),
    clientName: "",
    clientEmail: "",
    lineItems: [emptyItem()],
    notes: "",
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setInvoice((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateLineItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const addLineItem = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, emptyItem()],
    }));
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }));
  }, []);

  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.amount, 0);
  const tax = subtotal * 0.16; // Kenya VAT 16%
  const total = subtotal + tax;

  const resetInvoice = useCallback(() => {
    setInvoice({
      invoiceNumber: nextInvoiceNumber(),
      date: today(),
      dueDate: in30Days(),
      clientName: "",
      clientEmail: "",
      lineItems: [emptyItem()],
      notes: "",
    });
    setShowPreview(false);
  }, []);

  return {
    invoice,
    updateField,
    updateLineItem,
    addLineItem,
    removeLineItem,
    subtotal,
    tax,
    total,
    showPreview,
    setShowPreview,
    resetInvoice,
  };
}
