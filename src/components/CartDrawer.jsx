import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import CyberAssetVisual from './CyberAssetVisual.jsx';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeShippingThreshold = 50.0;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0.0 : 7.90;
  const total = subtotal + shipping;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-[#0b0e14] border-l border-[#1c2436] shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#10141e]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-['Orbitron'] font-bold text-base text-white">
                  DEIN WARENKORB
                </h2>
                <span className="text-xs font-mono text-zinc-400">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} ARTIKEL
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress bar */}
          <div className="p-4 bg-[#141a26] border-b border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-3.5 h-3.5 text-[#00e5ff]" />
                {subtotal >= freeShippingThreshold ? (
                  <strong className="text-emerald-400">KOSTENLOSER VERSAND ERREICHT!</strong>
                ) : (
                  <span>Noch <strong className="text-[#00e5ff]">CHF {(freeShippingThreshold - subtotal).toFixed(2)}</strong> bis Gratisversand</span>
                )}
              </span>
              <span className="text-zinc-400">{Math.round(progressToFreeShipping)}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#0a0d14] overflow-hidden p-0.5 border border-white/5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#ff003c] transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-3">
                <ShoppingBag className="w-16 h-16 text-zinc-700 stroke-[1.5]" />
                <p className="font-['Orbitron'] text-sm text-zinc-400">Dein Warenkorb ist noch leer.</p>
                <p className="text-xs font-mono max-w-xs">Wähle eine eisige DUO MIX 6-Pack Box oder deinen Lieblings-Winter-Flavor!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-[#101520] border border-white/5"
                >
                  {/* Item Visual Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-[#090b10] border border-white/10 flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <CyberAssetVisual 
                      product={item}
                      viewMode={item.isBox ? 'box' : 'cans_snow'}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-['Orbitron'] font-bold text-xs text-white truncate">
                      {item.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#00e5ff] block">
                      {item.volume || '500ml'}
                    </span>
                    <span className="font-mono font-bold text-xs text-zinc-300">
                      CHF {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 bg-[#171f2e] p-1 rounded-lg border border-white/5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-[#212c40] hover:bg-[#2b3952] text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-[#212c40] hover:bg-[#2b3952] text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-zinc-500 hover:text-[#ff003c] transition-colors"
                    title="Entfernen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Totals and Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-[#10141e] border-t border-white/10 space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Zwischensumme</span>
                  <span>CHF {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Versand (A-Post Swiss Post)</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-400">KOSTENLOS</strong> : `CHF ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Gesamtbetrag (inkl. MwSt.)</span>
                  <span className="font-['Orbitron'] text-lg text-[#00e5ff]">CHF {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff003c] to-[#e60035] hover:from-[#e60035] hover:to-[#ff1a4f] text-white font-['Orbitron'] font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,60,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>ZUR KASSE GEHEN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Twint • WhatsApp Order • Schneller Versand</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
