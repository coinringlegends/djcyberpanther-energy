import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, QrCode, Smartphone, Send, Upload, 
  CreditCard, ArrowLeft, Loader2, Sparkles, AlertCircle, Copy, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTwintLink, generateTwintQrDataUrl, uploadTwintPaymentProof, TWINT_FORMATTED_PHONE } from '../utils/twint.js';
import { sendOrderWhatsApp, ORDER_PHONE } from '../utils/whatsapp.js';

export default function Checkout({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess
}) {
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Payment method: 'TWINT' | 'WHATSAPP' | 'STRIPE'
  const [paymentMethod, setPaymentMethod] = useState('TWINT');
  
  // Payment proof file
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal >= 50.0 || subtotal === 0 ? 0.0 : 7.90;
  const total = subtotal + shipping;

  const twintDeeplink = getTwintLink(total);
  const twintQrUrl = generateTwintQrDataUrl(total, `CP-${formData.name.replace(/\s+/g, '') || 'KUNDE'}`);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProofChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCopyTwint = () => {
    navigator.clipboard?.writeText("0763227981");
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      alert("Bitte fülle alle erforderlichen Felder (Name, Adresse, Telefon) aus!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload payment proof if provided
      let proofUrl = null;
      if (proofFile) {
        proofUrl = await uploadTwintPaymentProof(proofFile, formData.name.replace(/\s+/g, '_'));
      }

      // 2. Dispatch order via WhatsApp and save to Firestore "orders"
      const result = await sendOrderWhatsApp({
        customerName: formData.name,
        customerAddress: formData.address,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        cartItems,
        totalAmount: total,
        paymentMethod,
        twintProofUrl: proofUrl,
        notes: formData.notes
      });

      // 3. Trigger confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00e5ff', '#ff003c', '#ffffff', '#0a3d1f']
        });
      } catch (err) {
        // Confetti non-critical
      }

      setOrderResult({
        ...result,
        total,
        customerName: formData.name,
        paymentMethod
      });

      if (onOrderSuccess) {
        onOrderSuccess();
      }
    } catch (err) {
      console.error("Order submission failed:", err);
      alert("Es gab ein Problem beim Absenden der Bestellung. Bitte versuche es erneut oder kontaktiere uns direkt via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-xl animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-3xl bg-[#0c0f16] border border-[#1e2638] shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#111624] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-['Orbitron'] font-black text-lg sm:text-xl text-white">
                CHECKOUT & ZAHLUNG
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                DJ CYBERPANTHER ENERGY • SCHWEIZ & LIECHTENSTEIN
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {orderResult ? (
            /* Order Success View */
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40">
                  BESTELLUNG ERFOLGREICH ÜBERMITTELT
                </span>
                <h3 className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-white pt-2">
                  VIELEN DANK, {orderResult.customerName}!
                </h3>
                <p className="text-zinc-300 font-mono text-sm">
                  Bestell-Referenz: <strong className="text-[#00e5ff] text-base">{orderResult.reference}</strong>
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-[#111724] border border-white/10 max-w-md mx-auto text-left text-xs font-mono space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Gesamtbetrag:</span>
                  <strong className="text-white text-sm">CHF {orderResult.total.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Zahlungsmethode:</span>
                  <strong className="text-[#00e5ff]">{orderResult.paymentMethod}</strong>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>WhatsApp Benachrichtigung:</span>
                  <span className="text-emerald-400 font-bold">
                    {orderResult.apiDispatched ? 'Direkt versendet' : 'Bereit zur Bestätigung'}
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Send Button */}
              {orderResult.waMeUrl && (
                <div className="pt-2">
                  <a
                    href={orderResult.waMeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-['Rajdhani'] font-bold text-base tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
                  >
                    <Send className="w-5 h-5" />
                    <span>BESTELLUNG IN WHATSAPP ÖFFNEN / SENDEN</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-[#1a2233] hover:bg-[#25324e] text-white font-mono text-xs transition-colors"
                >
                  ZURÜCK ZUM SHOP
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-8">
              {/* Step 1: Customer Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-['Orbitron'] font-bold text-white">
                  <span className="w-6 h-6 rounded-full bg-[#00e5ff] text-black text-xs flex items-center justify-center font-black">1</span>
                  <span>LIEFERADRESSE (SCHWEIZ & LIECHTENSTEIN)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-400">Vollständiger Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="z.B. Luca Meier"
                      className="w-full px-4 py-3 rounded-xl bg-[#121622] border border-white/10 focus:border-[#00e5ff] focus:outline-none text-white placeholder-zinc-600"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-400">Lieferadresse & Ort *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Strasse, Hausnummer, PLZ & Ort"
                      className="w-full px-4 py-3 rounded-xl bg-[#121622] border border-white/10 focus:border-[#00e5ff] focus:outline-none text-white placeholder-zinc-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400">Mobiltelefon (WhatsApp) *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="079 123 45 67"
                      className="w-full px-4 py-3 rounded-xl bg-[#121622] border border-white/10 focus:border-[#00e5ff] focus:outline-none text-white placeholder-zinc-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400">E-Mail Adresse (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.ch"
                      className="w-full px-4 py-3 rounded-xl bg-[#121622] border border-white/10 focus:border-[#00e5ff] focus:outline-none text-white placeholder-zinc-600"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-['Orbitron'] font-bold text-white">
                  <span className="w-6 h-6 rounded-full bg-[#00e5ff] text-black text-xs flex items-center justify-center font-black">2</span>
                  <span>ZAHLUNGSMETHODE WÄHLEN</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: TWINT */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('TWINT')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'TWINT'
                        ? 'bg-[#15202f] border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.3)]'
                        : 'bg-[#10141e] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <QrCode className="w-6 h-6 text-[#00e5ff]" />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        BELIEBT
                      </span>
                    </div>
                    <span className="font-['Orbitron'] font-bold text-sm text-white block">TWINT</span>
                    <span className="text-[11px] font-mono text-zinc-400">QR-Code & Deeplink</span>
                  </button>

                  {/* Option 2: WHATSAPP BESTELLUNG */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WHATSAPP')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'WHATSAPP'
                        ? 'bg-[#15241d] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'bg-[#10141e] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Smartphone className="w-6 h-6 text-emerald-400" />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        DIREKT
                      </span>
                    </div>
                    <span className="font-['Orbitron'] font-bold text-sm text-white block">WHATSAPP</span>
                    <span className="text-[11px] font-mono text-zinc-400">Order an 079 833 93 87</span>
                  </button>

                  {/* Option 3: STRIPE / KARTE */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('STRIPE')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'STRIPE'
                        ? 'bg-[#201524] border-[#ff003c] shadow-[0_0_20px_rgba(255,0,60,0.3)]'
                        : 'bg-[#10141e] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="w-6 h-6 text-[#ff003c]" />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">
                        ONLINE
                      </span>
                    </div>
                    <span className="font-['Orbitron'] font-bold text-sm text-white block">KREDITKARTE</span>
                    <span className="text-[11px] font-mono text-zinc-400">Visa / Mastercard / Apple Pay</span>
                  </button>
                </div>

                {/* TWINT Interactive Box */}
                {paymentMethod === 'TWINT' && (
                  <div className="p-5 rounded-2xl bg-[#121927] border border-[#00e5ff]/40 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Dynamic Twint QR Code */}
                      <div className="p-3 bg-[#0a0a0a] rounded-2xl border border-[#00e5ff]/60 shadow-[0_0_25px_rgba(0,229,255,0.25)] flex flex-col items-center">
                        <img 
                          src={twintQrUrl} 
                          alt="TWINT QR Code" 
                          className="w-40 h-40 rounded-lg"
                        />
                        <span className="text-[10px] font-mono text-[#00e5ff] mt-2 font-bold tracking-widest">
                          TWINT SCAN BAR
                        </span>
                      </div>

                      {/* Twint details & Mobile launcher */}
                      <div className="space-y-3 flex-1 text-xs font-mono">
                        <div className="space-y-1">
                          <span className="text-zinc-400 block">TWINT EMPFÄNGER NUMMER:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-white bg-[#0b0e14] px-3 py-1.5 rounded-lg border border-white/10">
                              {TWINT_FORMATTED_PHONE}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyTwint}
                              className="px-2.5 py-1.5 rounded-lg bg-[#1c2638] hover:bg-[#25324e] text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                              title="Nummer kopieren"
                            >
                              {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedNumber ? 'Kopiert' : 'Kopieren'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-zinc-400">Exakter Betrag:</span>
                          <span className="text-sm font-bold text-[#00e5ff] block">
                            CHF {total.toFixed(2)}
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-zinc-400">Zahlungszweck / Referenz:</span>
                          <span className="text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded border border-white/5 inline-block">
                            CYBERPANTHER {formData.name || 'KUNDE'}
                          </span>
                        </div>

                        {/* Mobile Direct Twint App Link */}
                        <div className="pt-1">
                          <a
                            href={twintDeeplink}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00e5ff] text-black font-['Rajdhani'] font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_15px_#00e5ff] transition-all"
                          >
                            <Smartphone className="w-4 h-4" />
                            <span>MIT TWINT APP BEZAHLEN (HANDY)</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Screenshot Upload as Payment Proof */}
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <label className="text-xs font-mono text-zinc-300 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-[#00e5ff]" />
                        <span>Optional: Twint-Screenshot als Zahlungsbeweis hochladen</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofChange}
                        className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-[#1f2a3e] file:text-white hover:file:bg-[#2b3a56] cursor-pointer"
                      />
                      {proofPreview && (
                        <div className="mt-2 flex items-center gap-3 p-2 bg-[#0a0d14] rounded-lg border border-white/10">
                          <img src={proofPreview} alt="Beleg Vorschau" className="w-12 h-12 object-cover rounded" />
                          <span className="text-xs text-emerald-400 font-mono">Screenshot geladen ({proofFile?.name})</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* WhatsApp Info Box */}
                {paymentMethod === 'WHATSAPP' && (
                  <div className="p-4 rounded-2xl bg-[#111e18] border border-emerald-500/40 text-xs font-mono space-y-2 text-zinc-300">
                    <p className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Smartphone className="w-4 h-4" />
                      <span>Bestellung via WhatsApp & Calmebot API:</span>
                    </p>
                    <p>
                      Deine Bestellung wird direkt an unsere WhatsApp Bestell-Zentrale (<strong className="text-white">079 833 93 87</strong>) 
                      übermittelt mit deinen Artikeln, Adresse und Totalbetrag.
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Wir bestätigen die Bestellung umgehend per WhatsApp mit den Versanddetails.
                    </p>
                  </div>
                )}

                {/* Stripe Mock Info Box */}
                {paymentMethod === 'STRIPE' && (
                  <div className="p-4 rounded-2xl bg-[#1b1422] border border-[#ff003c]/40 text-xs font-mono space-y-2 text-zinc-300">
                    <p className="flex items-center gap-2 text-[#ff003c] font-bold">
                      <CreditCard className="w-4 h-4" />
                      <span>Sichere Kartenzahlung (Stripe Mock):</span>
                    </p>
                    <p>
                      Test-Modus aktiv. Deine Bestellung wird sofort als bezahlt in unserem System erfasst und zur Auslieferung freigegeben.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Summary & Submit Button */}
              <div className="p-5 rounded-2xl bg-[#111622] border border-white/10 space-y-4">
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Artikel ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
                    <span>CHF {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Versand</span>
                    <span>{shipping === 0 ? <strong className="text-emerald-400">KOSTENLOS</strong> : `CHF ${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-white">
                    <span>Total</span>
                    <span className="font-['Orbitron'] text-xl text-[#00e5ff]">CHF {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff003c] via-[#e60035] to-[#ff003c] hover:from-[#ff1a4f] hover:to-[#e60035] text-white font-['Orbitron'] font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(255,0,60,0.6)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>BESTELLUNG WIRD VERARBEITET...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>JETZT BESTELLEN (CHF {total.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
