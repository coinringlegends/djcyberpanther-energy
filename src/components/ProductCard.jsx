import React, { useState } from 'react';
import { Plus, Eye, Check, Sparkles, Layers, Box as BoxIcon } from 'lucide-react';
import CyberAssetVisual from './CyberAssetVisual.jsx';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onViewDetails 
}) {
  const [viewMode, setViewMode] = useState(product?.isBox ? 'box' : 'cans_snow');
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const isBox = product?.isBox;

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="group relative flex flex-col rounded-2xl bg-[#0d1017] border border-[#1d2433] hover:border-[#00e5ff]/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Top Badges Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-md bg-[#ff003c]/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-md">
              {product.badge}
            </span>
          )}
          {isBox && (
            <span className="px-2.5 py-1 rounded-md bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50 font-mono text-[10px] font-bold tracking-wider">
              3.0L TOTAL
            </span>
          )}
        </div>

        <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
          SUGAR FREE
        </span>
      </div>

      {/* Visual Container */}
      <div className="relative w-full aspect-square bg-gradient-to-b from-[#111622] to-[#090b10] flex items-center justify-center p-3 overflow-hidden">
        <CyberAssetVisual 
          product={product} 
          viewMode={viewMode}
          className="w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* 2-View Switcher (MIT Verpackung vs OHNE Verpackung) */}
        {isBox && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="absolute bottom-3 right-3 z-30 flex items-center bg-black/80 backdrop-blur-md rounded-lg p-1 border border-white/10 shadow-lg text-[10px] font-mono"
          >
            <button
              type="button"
              onClick={() => setViewMode('box')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                viewMode === 'box' 
                  ? 'bg-[#00e5ff] text-black font-bold shadow-[0_0_8px_#00e5ff]' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Box mit Verpackung"
            >
              <BoxIcon className="w-3 h-3" />
              <span>BOX</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cans_snow')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                viewMode === 'cans_snow' 
                  ? 'bg-[#ff003c] text-white font-bold shadow-[0_0_8px_#ff003c]' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="2 Dosen im Schnee (ohne Verpackung)"
            >
              <Layers className="w-3 h-3" />
              <span>SCHNEE</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Flavor Pill tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.flavor1 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161c28] text-zinc-300 border border-white/5">
                {product.flavor1}
              </span>
            )}
            {product.flavor2 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161c28] text-zinc-300 border border-white/5">
                {product.flavor2}
              </span>
            )}
          </div>

          <h3 className="font-['Orbitron'] font-bold text-lg text-white group-hover:text-[#00e5ff] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-zinc-400 font-['Rajdhani'] font-medium text-xs sm:text-sm line-clamp-2 mt-1">
            {product.tagline}
          </p>

          <div className="mt-2 text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="text-[#00e5ff]">{product.volume}</span>
            <span>•</span>
            <span className="text-zinc-500">32mg/100ml Koffein</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-zinc-400 block">PREIS</span>
            <span className="font-['Orbitron'] font-black text-xl text-white">
              CHF {product.price?.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`px-3.5 py-2.5 rounded-xl font-['Rajdhani'] font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-1.5 active:scale-95 ${
                justAdded 
                  ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] text-black hover:shadow-[0_0_15px_rgba(0,229,255,0.5)] font-black'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>IM KORB</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>HINZUFÜGEN</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
