import { ArrowLeft, Printer, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvoiceData } from "@/types/invoice";
import { COMPANY } from "@/types/invoice";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

interface Props {
  invoice: InvoiceData;
  subtotal: number;
  tax: number;
  total: number;
  onBack: () => void;
  onReset: () => void;
}

export default function InvoicePreview({ invoice, subtotal, tax, total, onBack, onReset }: Props) {
  const handlePrint = () => window.print();

  const handleSend = () => {
    const itemLines = invoice.lineItems
      .filter((item) => item.description)
      .map((item, idx) =>
        `${idx + 1}. ${item.description} — Qty: ${item.quantity} x KES ${item.amount.toLocaleString("en-KE", { minimumFractionDigits: 2 })} = KES ${(item.quantity * item.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}`
      )
      .join("\n");

    const body = [
      `Dear ${invoice.clientName},`,
      ``,
      `Please find below your invoice details from ${COMPANY.name}.`,
      ``,
      `Invoice Number: ${invoice.invoiceNumber}`,
      `Date: ${new Date(invoice.date).toLocaleDateString("en-KE", { dateStyle: "long" })}`,
      `Due Date: ${new Date(invoice.dueDate).toLocaleDateString("en-KE", { dateStyle: "long" })}`,
      ``,
      `--- Items ---`,
      itemLines,
      ``,
      `Subtotal: KES ${subtotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`,
      `VAT (16%): KES ${tax.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`,
      `Total Due: KES ${total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`,
      ``,
      invoice.notes ? `Notes: ${invoice.notes}\n` : "",
      `Thank you for choosing ${COMPANY.name}.`,
      `${COMPANY.email} | ${COMPANY.location}`,
    ].join("\n");

    const mailtoLink = `mailto:${encodeURIComponent(invoice.clientEmail)}?subject=${encodeURIComponent(`Invoice ${invoice.invoiceNumber} from ${COMPANY.name}`)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    toast.success(`Opening email to ${invoice.clientEmail}`, {
      description: `Invoice ${invoice.invoiceNumber} is ready to send.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex gap-3 no-print">
        {/* <Button variant="outline" onClick={onBack} className="gap-2"> */}
        <Button onClick={onBack} className="gap-2 border">
          <ArrowLeft className="w-4 h-4" /> Edit
        </Button>
        <div className="flex-1" />

        {/* <Button variant="outline" onClick={handlePrint} className="gap-2"> */}
        <Button onClick={handlePrint} className="gap-2 border">
          <Printer className="w-4 h-4" /> Print
        </Button>
        <Button onClick={handleSend} className="gap-2">
          <Send className="w-4 h-4" /> Send Invoice
        </Button>
      </div>

      {/* Invoice Document */}
      <div className="bg-card rounded-xl invoice-shadow overflow-hidden max-w-3xl mx-auto" id="invoice-doc">
        {/* Header */}
        <div className="bg-invoice-header text-invoice-header-foreground p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="PixelsPivot Logo" className="w-16 h-16 rounded-lg object-contain bg-card/10 p-1" />
              <div>
                <h1 className="text-xl font-display font-bold">{COMPANY.name}</h1>
                <p className="text-sm opacity-80">{COMPANY.location}</p>
                <p className="text-sm opacity-80">{COMPANY.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-display font-bold opacity-90">INVOICE</p>
              <p className="font-mono text-sm mt-1 opacity-80">{invoice.invoiceNumber}</p>
            </div>
          </div>
        </div>

        {/* Meta + Client */}
        <div className="p-8 grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Bill To</p>
            <p className="text-lg font-semibold text-foreground">{invoice.clientName}</p>
            <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>
          </div>
          <div className="text-right space-y-1">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Date</p>
              <p className="text-sm font-medium text-foreground">{new Date(invoice.date).toLocaleDateString("en-KE", { dateStyle: "long" })}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Due Date</p>
              <p className="text-sm font-medium text-foreground">{new Date(invoice.dueDate).toLocaleDateString("en-KE", { dateStyle: "long" })}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="px-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-invoice-header text-invoice-header-foreground">
                <th className="text-left py-3 px-4 rounded-tl-lg font-medium">#</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
                <th className="text-center py-3 px-4 font-medium">Qty</th>
                <th className="text-right py-3 px-4 font-medium">Price</th>
                <th className="text-right py-3 px-4 rounded-tr-lg font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems
                .filter((item) => item.description)
                .map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? "bg-invoice-stripe" : ""}>
                    <td className="py-3 px-4 text-muted-foreground">{idx + 1}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{item.description}</td>
                    <td className="py-3 px-4 text-center text-foreground">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-foreground">
                      {item.amount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right text-foreground font-semibold">
                      {(item.quantity * item.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-8 py-6">
          <div className="ml-auto w-64 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>KES {subtotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>VAT (16%)</span>
              <span>KES {tax.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-lg font-display font-bold text-primary pt-3 border-t-2 border-primary">
              <span>Total Due</span>
              <span>KES {total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Notes & Footer */}
        {invoice.notes && (
          <div className="px-8 pb-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Notes</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        <div className="bg-invoice-header text-invoice-header-foreground text-center py-4 text-xs opacity-80 mt-4">
          Thank you for choosing us  — {COMPANY.name}
        </div>
      </div>

      {/* New Invoice */}
      <div className="text-center no-print">
        {/* <Button variant="outline" onClick={onReset} className="mt-2"> */}
        <Button onClick={onReset} className="mt-2 border">
          Create New Invoice
        </Button>
      </div>
    </div>
  );
}
