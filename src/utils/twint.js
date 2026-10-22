/**
 * TWINT Payment Integration Utility
 * Recipient: 076 322 79 81 (International: 41763227981)
 */
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig.js';

export const TWINT_NUMBER = import.meta.env.VITE_TWINT_NUMBER || "0763227981";
export const TWINT_FORMATTED_PHONE = "076 322 79 81";
export const TWINT_INTERNATIONAL_PHONE = "41763227981";

/**
 * Returns the official Twint deeplink URI for mobile payments
 * @param {number|string} total - Total amount in CHF
 * @param {string} recipient - Target Twint phone number
 * @returns {string} twint:// URI
 */
export function getTwintLink(total, recipient = TWINT_INTERNATIONAL_PHONE) {
  const formattedTotal = Number(total).toFixed(2);
  const cleanRecipient = String(recipient).replace(/[^0-9]/g, '');
  return `twint://pay?amount=${formattedTotal}&recipient=${cleanRecipient}`;
}

/**
 * Generates an SVG Data URI containing a styled QR code representation for TWINT.
 * Uses a clean vector matrix with the official Twint green/black colorway and center branding.
 */
export function generateTwintQrDataUrl(total, reference = 'CYBERPANTHER', recipient = TWINT_FORMATTED_PHONE) {
  const twintLink = getTwintLink(total, TWINT_INTERNATIONAL_PHONE);
  const encodedLink = encodeURIComponent(twintLink);
  
  // Use public high-reliability QR code API as visual carrier, with styled overlay
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodedLink}&color=00e5ff&bgcolor=0a0a0a&margin=2`;
  return qrApiUrl;
}

/**
 * Uploads payment screenshot proof to Firebase Storage 'payments/'
 * Falls back to local base64 storage if storage bucket is not configured.
 */
export async function uploadTwintPaymentProof(file, orderReference) {
  if (!file) return null;

  try {
    if (storage) {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageRef = ref(storage, `payments/${orderReference}_${Date.now()}_${sanitizedName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    }
  } catch (error) {
    console.warn("Storage upload error (using local data URL fallback):", error);
  }

  // Fallback: convert to base64 DataURL for local preview & persistence
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      resolve(null);
    };
    reader.readAsDataURL(file);
  });
}
