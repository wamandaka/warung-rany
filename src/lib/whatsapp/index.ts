import { CartItem } from "@/types";
import { formatRupiah } from "@/lib/utils";

/**
 * Normalize Indonesian phone numbers to WhatsApp international format (e.g. 081234567890 -> 6281234567890)
 */
export function normalizeWhatsAppNumber(rawNumber: string): string {
  if (!rawNumber) return "";
  
  // Remove non-numeric characters except leading plus if any
  let cleaned = rawNumber.trim().replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  // If starts with 0 (e.g. 0812...), replace leading 0 with 62
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  } else if (cleaned.startsWith("8")) {
    // If entered without leading 0 or 62 (e.g. 812...)
    cleaned = "62" + cleaned;
  }

  return cleaned;
}

/**
 * Validate that phone number looks like a valid Indonesian mobile number
 */
export function isValidIndonesianPhone(phone: string): boolean {
  const normalized = normalizeWhatsAppNumber(phone);
  // Indonesian numbers usually start with 628 and have 10-14 digits
  return /^628[1-9][0-9]{7,11}$/.test(normalized);
}

export interface WhatsAppOrderDetails {
  items: CartItem[];
  customerName: string;
  customerNote?: string;
  greeting?: string;
}

/**
 * Build pre-filled WhatsApp order message
 */
export function generateWhatsAppOrderMessage({
  items,
  customerName,
  customerNote,
  greeting = "Halo Kak, saya mau pesan:",
}: WhatsAppOrderDetails): string {
  const lines: string[] = [];

  // 1. Greeting
  lines.push(greeting);
  lines.push("");

  // 2. Product list with quantity and subtotal
  let total = 0;
  items.forEach((item, index) => {
    const itemSubtotal = item.price * item.quantity;
    total += itemSubtotal;
    lines.push(
      `${index + 1}. ${item.name} × ${item.quantity} = ${formatRupiah(itemSubtotal)}`
    );
  });

  lines.push("");

  // 3. Total
  lines.push(`Total: ${formatRupiah(total)}`);
  lines.push("");

  // 4. Customer Name
  lines.push(`Nama: ${customerName.trim()}`);

  // 5. Customer Note (optional)
  if (customerNote && customerNote.trim().length > 0) {
    lines.push("");
    lines.push("Catatan:");
    lines.push(customerNote.trim());
  }

  // 6. Confirmation reminder
  lines.push("");
  lines.push("Mohon konfirmasi ketersediaannya ya.");
  lines.push("Terima kasih 🙏");

  return lines.join("\n");
}

/**
 * Generate full WhatsApp URL
 */
export function generateWhatsAppUrl(
  phoneNumber: string,
  orderDetails: WhatsAppOrderDetails
): string {
  const normalizedPhone = normalizeWhatsAppNumber(phoneNumber);
  const message = generateWhatsAppOrderMessage(orderDetails);
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
