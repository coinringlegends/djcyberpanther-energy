/**
 * WhatsApp Order Integration via Meta Cloud API & Calmebot & Direct Fallback
 * Target: 079 833 93 87 (41798339387)
 * Template: WHATSAPP_TEMPLATE_ORDER with 4 variables: Name, Referenz, Total, Artikel
 */
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError } from '../firebaseConfig.js';

export const WHATSAPP_TEMPLATE_ORDER = import.meta.env.VITE_WHATSAPP_TEMPLATE_ORDER || "dj_cyberpanther_order";
export const ORDER_PHONE = import.meta.env.VITE_ORDER_PHONE || "0798339387";
export const PHONE_ID = import.meta.env.VITE_PHONE_ID || "your_meta_phone_id";
export const WHATSAPP_TOKEN = import.meta.env.VITE_WHATSAPP_TOKEN || "your_meta_token";

// Standardize Swiss numbers to international E.164 without leading plus
export const formatInternationalPhone = (rawPhone) => {
  let cleaned = String(rawPhone || ORDER_PHONE).replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '41' + cleaned.substring(1);
  }
  return cleaned;
};

/**
 * Summarizes cart items into a clean string for WhatsApp: "2x TANNENZAUBER, 1x DUO MIX"
 */
export function formatCartSummary(cartItems) {
  if (!cartItems || cartItems.length === 0) return "Keine Artikel";
  return cartItems
    .map(item => `${item.quantity}x ${item.name}`)
    .join(', ');
}

/**
 * Main WhatsApp Order Dispatch function
 * Sends WhatsApp message using Meta Cloud API template OR Calmebot API,
 * records the order in Firestore "orders", and provides 1-click wa.me link.
 *
 * @param {Object} orderData
 * @returns {Promise<{success: boolean, orderId: string, reference: string, waMeUrl: string, apiDispatched: boolean}>}
 */
export async function sendOrderWhatsApp({
  customerName,
  customerAddress,
  customerPhone,
  customerEmail = '',
  cartItems,
  totalAmount,
  paymentMethod = 'TWINT',
  twintProofUrl = null,
  notes = ''
}) {
  const reference = `CP-${Math.floor(100000 + Math.random() * 900000)}`;
  const totalFormatted = `CHF ${Number(totalAmount).toFixed(2)}`;
  const artikelFormatted = formatCartSummary(cartItems);
  const targetRecipient = formatInternationalPhone(ORDER_PHONE);

  let apiDispatched = false;

  // 1. Meta WhatsApp Cloud API with template
  if (PHONE_ID && PHONE_ID !== 'your_meta_phone_id' && WHATSAPP_TOKEN && WHATSAPP_TOKEN !== 'your_meta_token') {
    try {
      const payload = {
        messaging_product: "whatsapp",
        to: targetRecipient,
        type: "template",
        template: {
          name: WHATSAPP_TEMPLATE_ORDER,
          language: { code: "de" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: customerName }, // Var 1: Name
                { type: "text", text: reference },    // Var 2: Referenz
                { type: "text", text: totalFormatted },// Var 3: Total
                { type: "text", text: artikelFormatted } // Var 4: Artikel
              ]
            }
          ]
        }
      };

      const res = await fetch(`https://graph.facebook.com/v19.0/${PHONE_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        apiDispatched = true;
      } else {
        console.warn("Meta WhatsApp API error response:", await res.text());
      }
    } catch (err) {
      console.warn("Meta WhatsApp API request failed:", err);
    }
  }

  // 2. Calmebot API check if Meta is not active
  if (!apiDispatched && import.meta.env.VITE_CALMEBOT_API_KEY) {
    try {
      const res = await fetch('https://api.calmebot.com/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_CALMEBOT_API_KEY}`,
          'X-API-Secret': import.meta.env.VITE_CALMEBOT_API_SECRET || ''
        },
        body: JSON.stringify({
          to: targetRecipient,
          message: `NEUE BESTELLUNG DJ CYBERPANTHER: ${artikelFormatted} | Referenz: ${reference} | Kunde: ${customerName} | Adresse: ${customerAddress} | Total: ${totalFormatted}`
        })
      });
      if (res.ok) apiDispatched = true;
    } catch (e) {
      console.warn('Calmebot call warning:', e);
    }
  }

  // 3. Fallback direct WhatsApp Click-to-Chat URL
  const waMessage = `*NEUE BESTELLUNG: DJ CYBERPANTHER ENERGY*\n` +
    `----------------------------------------\n` +
    `🔖 *Referenz:* ${reference}\n` +
    `👤 *Kunde:* ${customerName}\n` +
    `📍 *Adresse:* ${customerAddress}\n` +
    `📞 *Tel:* ${customerPhone}\n` +
    (customerEmail ? `✉️ *Email:* ${customerEmail}\n` : '') +
    `📦 *Artikel:* ${artikelFormatted}\n` +
    `💰 *Total:* ${totalFormatted}\n` +
    `💳 *Zahlung:* ${paymentMethod}` +
    (notes ? `\n📝 *Hinweis:* ${notes}` : '');

  const waMeUrl = `https://wa.me/${targetRecipient}?text=${encodeURIComponent(waMessage)}`;

  // 4. Save order to Firestore collection "orders"
  let orderId = reference;
  try {
    if (db) {
      const orderRecord = {
        orderId: reference,
        reference,
        customerName,
        customerAddress,
        customerPhone,
        customerEmail,
        cartItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          volume: item.volume || '500ml',
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: Number(totalAmount),
        formattedTotal: totalFormatted,
        formattedArticles: artikelFormatted,
        paymentMethod,
        paymentStatus: paymentMethod === 'TWINT' ? 'warten_auf_beleg' : 'eingegangen',
        twintProofUrl: twintProofUrl || null,
        whatsappDispatched: apiDispatched,
        status: 'neu',
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderRecord);
      orderId = docRef.id;
    }
  } catch (err) {
    handleFirestoreError(err, 'create', 'orders');
  }

  // Backup in LocalStorage for admin instant viewing even offline
  try {
    const existingOrders = JSON.parse(localStorage.getItem('dj_cyberpanther_orders') || '[]');
    existingOrders.unshift({
      id: orderId,
      reference,
      customerName,
      customerAddress,
      customerPhone,
      customerEmail,
      cartItems,
      totalAmount,
      formattedTotal: totalFormatted,
      formattedArticles: artikelFormatted,
      paymentMethod,
      twintProofUrl,
      whatsappDispatched: apiDispatched,
      status: 'neu',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('dj_cyberpanther_orders', JSON.stringify(existingOrders.slice(0, 100)));
  } catch (e) {
    console.warn('LocalStorage backup error:', e);
  }

  return {
    success: true,
    orderId,
    reference,
    waMeUrl,
    apiDispatched
  };
}
