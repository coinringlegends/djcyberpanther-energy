import React from 'react';
import { ShoppingBag, ShieldCheck, Flame, Radio, Sparkles } from 'lucide-react';

export default function Navbar({ 
  cartCount = 0, 
  onOpenCart, 
  onNavigate, 
  currentView = 'shop' 
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0a0a0a]/90 border-b border-[#1e2330]">
      {/* Top Winter Rave Banner */}
      <div className="bg-gradient-to-r from-[#0a3d1f] via-[#051119] to-[#2b0814] px-4 py-1.5 text-xs text-center border-b border-white/5 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 text-[#00e5ff] font-mono tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          WINTER FOREST RAVE EDITION
        </span>
        <span className="hidden sm:inline text-white/30">•</span>
        <span className="hidden sm:inline text-zinc-300">
          Ab CHF 50.- <strong className="text-[#00e5ff]">Kostenloser Versand</strong> (Schweiz & Liechtenstein)
        </span>
        <span className="hidden sm:inline text-white/30">•</span>
        <span className="text-[#ff003c] font-semibold text-[11px] tracking-wide">
          100% SUGAR FREE
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Cyber Panther Eyes */}
        <button 
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-3.5 group text-left transition-transform active:scale-95"
        >
          {/* Cyber Panther Emblem */}
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-[#181d26] to-[#0c0f14] border border-[#00e5ff]/40 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.25)] group-hover:border-[#ff003c]/60 group-hover:shadow-[0_0_20px_rgba(255,0,60,0.35)] transition-all">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
              {/* Panther Head Geometric Outline */}
              <polygon points="50,15 15,40 25,75 50,92 75,75 85,40" fill="#050608" stroke="#00e5ff" strokeWidth="3" />
              <polyline points="25,40 50,55 75,40" stroke="#00e5ff" strokeWidth="2" strokeOpacity="0.7" />
              <line x1="50" y1="18" x2="50" y2="55" stroke="#00e5ff" strokeWidth="2" strokeOpacity="0.5" />
              {/* Glowing Red Eyes */}
              <ellipse cx="38" cy="46" rx="6" ry="3" fill="#ff003c" className="animate-pulse" />
              <ellipse cx="62" cy="46" rx="6" ry="3" fill="#ff003c" className="animate-pulse" />
              <circle cx="38" cy="46" r="1.5" fill="#ffffff" />
              <circle cx="62" cy="46" r="1.5" fill="#ffffff" />
            </svg>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#ff003c] border-2 border-[#0a0a0a] flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-white animate-ping" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Orbitron'] font-black tracking-wider text-lg sm:text-xl text-white group-hover:text-[#00e5ff] transition-colors">
                DJ CYBERPANTHER
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/40 font-bold uppercase tracking-widest">
                ENERGY
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 tracking-widest flex items-center gap-1.5">
              <span>CYBERPUNK</span>
              <span className="text-[#00e5ff]">•</span>
              <span>WINTER FOREST RAVE</span>
            </p>
          </div>
        </button>

        {/* Center Nav links */}
        <nav className="hidden md:flex items-center gap-8 font-['Rajdhani'] font-bold text-base tracking-wider">
          <button
            onClick={() => onNavigate('shop')}
            className={`transition-colors hover:text-[#00e5ff] ${
              currentView === 'shop' ? 'text-[#00e5ff] border-b-2 border-[#00e5ff] pb-1' : 'text-zinc-300'
            }`}
          >
            SHOP
          </button>
          <a
            href="#duo-mix"
            onClick={(e) => {
              if (currentView !== 'shop') onNavigate('shop');
            }}
            className="text-zinc-300 hover:text-[#ff003c] transition-colors flex items-center gap-1"
          >
            <span>DUO MIX BOXEN</span>
            <span className="text-[10px] bg-[#00e5ff]/20 text-[#00e5ff] px-1.5 py-0.5 rounded font-mono">
              3L
            </span>
          </a>
          <a
            href="#flavors"
            onClick={(e) => {
              if (currentView !== 'shop') onNavigate('shop');
            }}
            className="text-zinc-300 hover:text-[#00e5ff] transition-colors"
          >
            FLAVORS
          </a>
          <button
            onClick={() => onNavigate('admin')}
            className={`transition-colors hover:text-[#ff003c] flex items-center gap-1 text-sm font-mono ${
              currentView === 'admin' ? 'text-[#ff003c] font-bold' : 'text-zinc-400'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#ff003c] animate-pulse" />
            ADMIN PANEL
          </button>
        </nav>

        {/* Actions: Admin icon & Cart Drawer Button */}
        <div className="flex items-center gap-3">
          {/* Mobile Admin toggle */}
          <button
            onClick={() => onNavigate(currentView === 'admin' ? 'shop' : 'admin')}
            className="md:hidden text-zinc-400 hover:text-white p-2 rounded-lg border border-zinc-800"
            title="Admin"
          >
            <Radio className="w-4 h-4 text-[#ff003c]" />
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#121620] to-[#1c2230] border border-[#00e5ff]/40 hover:border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.2)] text-white hover:text-[#00e5ff] transition-all active:scale-95 font-['Rajdhani'] font-bold text-sm tracking-wider"
            aria-label="Warenkorb öffnen"
          >
            <ShoppingBag className="w-5 h-5 text-[#00e5ff]" />
            <span className="hidden sm:inline">WARENKORB</span>
            
            {cartCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-[#ff003c] text-white text-xs font-mono font-bold flex items-center justify-center shadow-[0_0_10px_#ff003c] animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
