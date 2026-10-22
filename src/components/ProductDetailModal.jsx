import React, { useState } from 'react';
import { X, Check, Plus, Minus, ShoppingBag, ShieldCheck, Zap, Layers, Box as BoxIcon, Info } from 'lucide-react';
import CyberAssetVisual from './CyberAssetVisual.jsx';

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}) {
  const [activeTab, setActiveTab] = useState(product?.isBox ? 'box' : 'cans_snow');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const isBox = product.isBox;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl bg-[#0c0f16] border border-[#1e2638] shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col lg:flex-row my-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 hover:bg-[#ff003c] text-zinc-400 hover:text-white transition-colors border border-white/10"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: 3D Visual Box / Cans in Snow */}
        <div className="lg:w-1/2 bg-gradient-to-b from-[#131926] to-[#080a0f] p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-white/10">
          {/* Top View Toggle Switch */}
          {isBox ? (
            <div className="w-full flex items-center justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('box')}
                className={`flex-1 py-2 px-3 rounded-xl font-['Rajdhani'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'box'
                    ? 'bg-[#00e5ff] text-black shadow-[0_0_15px_#00e5ff]'
                    : 'bg-[#182030] text-zinc-400 hover:text-white'
                }`}
              >
                <BoxIcon className="w-4 h-4" />
                <span>BILD 1: MIT VERPACKUNG (6-PACK)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cans_snow')}
                className={`flex-1 py-2 px-3 rounded-xl font-['Rajdhani'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'cans_snow'
                    ? 'bg-[#ff003c] text-white shadow-[0_0_15px_#ff003c]'
                    : 'bg-[#182030] text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>BILD 2: DOSEN IM SCHNEE</span>
              </button>
            </div>
          ) : (
            <div className="w-full py-1 text-center font-mono text-xs text-[#00e5ff] uppercase tracking-widest">
              FROST CONDE-VISUAL 500ML
            </div>
          )}

          {/* 3D Asset */}
          <div className="relative w-full max-w-[340px] aspect-square my-auto flex items-center justify-center">
            <CyberAssetVisual 
              product={product}
              viewMode={activeTab}
              className="w-full h-full"
            />
          </div>

          <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-2 border-t border-white/5">
            <span>PHOTOREALISTIC 3D PREVIEW</span>
            <span className="text-[#00e5ff]">SWISS RAVE DESIGN</span>
          </div>
        </div>

        {/* Right Side: Product Facts, Flavors, Nutrition & Add to Cart */}
        <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#ff003c]/20 border border-[#ff003c]/50 text-[#ff003c] font-mono text-[11px] font-bold uppercase">
                {product.category || 'Winter Edition'}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#00e5ff]/20 border border-[#00e5ff]/50 text-[#00e5ff] font-mono text-[11px] font-bold">
                {product.volume}
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-mono text-[11px] font-bold">
                100% SUGAR FREE
              </span>
            </div>

            <h2 className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-white">
              {product.name}
            </h2>

            <p className="text-zinc-300 font-['Rajdhani'] font-medium text-base leading-relaxed">
              {product.description}
            </p>

            {/* Flavor Breakdowns */}
            <div className="p-4 rounded-xl bg-[#121722] border border-white/10 space-y-2">
              <span className="text-xs font-mono text-[#00e5ff] tracking-wider uppercase block">
                FLAVOR PROFILE:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {product.flavor1 && (
                  <div className="bg-[#182030] p-2 rounded text-zinc-200">
                    <span className="text-zinc-400 block text-[10px]">FLAVOR 1</span>
                    {product.flavor1}
                  </div>
                )}
                {product.flavor2 && (
                  <div className="bg-[#182030] p-2 rounded text-zinc-200">
                    <span className="text-zinc-400 block text-[10px]">FLAVOR 2</span>
                    {product.flavor2}
                  </div>
                )}
              </div>
            </div>

            {/* Nutrition facts table */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                <Info className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>NÄHRWERTE (PRO 100ML):</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-[#10141f] p-2 rounded border border-white/5">
                  <span className="text-zinc-500 block text-[10px]">ENERGIE</span>
                  <span className="font-bold text-white">8 kJ / 2 kcal</span>
                </div>
                <div className="bg-[#10141f] p-2 rounded border border-white/5">
                  <span className="text-zinc-500 block text-[10px]">ZUCKER</span>
                  <span className="font-bold text-emerald-400">0 g (Sugar Free)</span>
                </div>
                <div className="bg-[#10141f] p-2 rounded border border-white/5">
                  <span className="text-zinc-500 block text-[10px]">KOFFEIN</span>
                  <span className="font-bold text-[#ff003c]">32 mg</span>
                </div>
              </div>
            </div>

            {/* Ingredients text */}
            <div className="text-[11px] font-mono text-zinc-400 leading-relaxed">
              <strong className="text-zinc-300">Zutaten: </strong>
              {product.ingredients || 'Wasser, Kohlensäure, Taurin (0.4%), Säuerungsmittel (Zitronensäure), Koffein (32mg/100ml), Guarana-Extrakt, B-Vitamine (Niacin, B6, B12), Süssungsmittel (Sucralose).'}
            </div>
          </div>

          {/* Quantity and Add to Cart Section */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-zinc-400 block">TOTAL BETRAG</span>
                <span className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-white">
                  CHF {(product.price * quantity).toFixed(2)}
                </span>
              </div>

              {/* Counter */}
              <div className="flex items-center gap-2 bg-[#141b29] border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-[#1b2438] hover:bg-[#25324e] text-white flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono font-bold text-white text-base">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-[#1b2438] hover:bg-[#25324e] text-white flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={added}
              className={`w-full py-4 rounded-xl font-['Orbitron'] font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all active:scale-95 ${
                added
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-[#00e5ff] via-[#00c2e0] to-[#ff003c] text-black hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] cursor-pointer'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>ERFOLGREICH HINZUGEFÜGT</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>IN DEN WARENKORB LEGEN</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
