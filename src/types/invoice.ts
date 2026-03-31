export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  lineItems: LineItem[];
  notes: string;
}

export const COMPANY = {
  name: "PixelsPivot Tech Kenya",
  email: "pixels.pivot.tech.ke@gmail.com",
  location: "Nairobi, Kenya",
} as const;
