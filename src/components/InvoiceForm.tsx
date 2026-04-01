import { Plus, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InvoiceData, LineItem } from "@/types/invoice";

interface Props {
  invoice: InvoiceData;
  updateField: <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => void;
  updateLineItem: (id: string, field: keyof LineItem, value: string | number) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  subtotal: number;
  tax: number;
  total: number;
  onPreview: () => void;
}

export default function InvoiceForm({
  invoice,
  updateField,
  updateLineItem,
  addLineItem,
  removeLineItem,
  subtotal,
  tax,
  total,
  onPreview,
}: Props) {
  const isValid = invoice.clientName && invoice.clientEmail && invoice.lineItems.some((i) => i.description && i.amount > 0);

  return (
    <div className="space-y-6">
      {/* Invoice Info */}
      <div className="bg-card rounded-xl p-6 invoice-shadow">
        <h2 className="text-lg font-display font-bold text-foreground mb-4">Invoice Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Invoice #</Label>
            <Input value={invoice.invoiceNumber} readOnly className="mt-1 bg-muted font-mono font-semibold text-foreground" />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Date</Label>
            <Input type="date" value={invoice.date} onChange={(e) => updateField("date", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Due Date</Label>
            <Input type="date" value={invoice.dueDate} onChange={(e) => updateField("dueDate", e.target.value)} className="mt-1" />
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="bg-card rounded-xl p-6 invoice-shadow">
        <h2 className="text-lg font-display font-bold text-foreground mb-4">Client Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Client Name / Business</Label>
            <Input
              placeholder="e.g. Acme Corp"
              value={invoice.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Client Email</Label>
            <Input
              type="email"
              placeholder="client@example.com"
              value={invoice.clientEmail}
              onChange={(e) => updateField("clientEmail", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-card rounded-xl p-6 invoice-shadow">
        <h2 className="text-lg font-display font-bold text-foreground mb-4">Services / Products</h2>
        <div className="space-y-3">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-3 text-xs uppercase tracking-wider text-muted-foreground font-medium px-1">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-3 text-right">Amount (KES)</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {invoice.lineItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 items-center bg-secondary/50 rounded-lg p-3">
              <div className="col-span-12 sm:col-span-5">
                <Input
                  placeholder="Service or product"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  className="bg-card"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                  className="text-center bg-card"
                />
              </div>
              <div className="col-span-5 sm:col-span-3">
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.amount || ""}
                  onChange={(e) => updateLineItem(item.id, "amount", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="text-right bg-card"
                />
              </div>
              <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {(item.quantity * item.amount).toLocaleString("en-KE")}
                </span>
                {invoice.lineItems.length > 1 && (
                  <button
                    onClick={() => removeLineItem(item.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* <Button onClick={addLineItem} variant="outline" className="mt-4 gap-2"> */}
        <Button onClick={addLineItem} className="mt-4 gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </Button>

        {/* Totals */}
        <div className="mt-6 border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>VAT (16%)</span>
            <span>KES {tax.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-lg font-display font-bold text-foreground pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">KES {total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-card rounded-xl p-6 invoice-shadow">
        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Notes / Payment Instructions</Label>
        <Textarea
          placeholder="e.g. Payment via M-Pesa to..."
          value={invoice.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          className="mt-2"
          rows={3}
        />
      </div>

      {/* Action */}
      {/* <Button onClick={onPreview} disabled={!isValid} size="lg" className="w-full gap-2 text-base font-display"> */}
      <Button onClick={onPreview} disabled={!isValid} className="w-full gap-2 text-base font-display">
        <Eye className="w-5 h-5" /> Preview Invoice
      </Button>
    </div>
  );
}
