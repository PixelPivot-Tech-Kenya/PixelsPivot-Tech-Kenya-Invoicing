import { FileText } from "lucide-react";
import { useInvoice } from "@/hooks/useInvoice";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import { COMPANY } from "@/types/invoice";

export default function Index() {
  const {
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
  } = useInvoice();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="bg-card border-b border-border no-print">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground rounded-lg p-2">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">{COMPANY.name}</h1>
            <p className="text-xs text-muted-foreground">Invoice Management</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {showPreview ? (
          <InvoicePreview
            invoice={invoice}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onBack={() => setShowPreview(false)}
            onReset={resetInvoice}
          />
        ) : (
          <InvoiceForm
            invoice={invoice}
            updateField={updateField}
            updateLineItem={updateLineItem}
            addLineItem={addLineItem}
            removeLineItem={removeLineItem}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onPreview={() => setShowPreview(true)}
          />
        )}
      </main>
    </div>
  );
}
