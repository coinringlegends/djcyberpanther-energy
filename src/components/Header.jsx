import React from 'react';
import { ShoppingBag, ShieldAlert, Sparkles, Flame, Volume2, VolumeX, Menu, X } from 'lucide-react';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  onNavigateAdmin, 
  currentView,
  onNavigateHome 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#090b10]/90 backdrop-blur-md border-b border-[#1b2336] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Cyber Panther Eyes */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Panther Icon with Glowing Red Eyes */}
          <div className="relative w-11 h-11 rounded-xl bg-[#0e121a] border border-[#1e273b] group-hover:border-[#00e5ff] flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              {/* Panther Head Geometric Face */}
              <polygon points="50,15 15,40 25,75 10,88 35,92 50,98 65,92 90,88 75,75 85,40" fill="#05070a" stroke="#1c2438" strokeWidth="3" />
              {/* Cyber Circuit Lines */}
              <line x1="50" y1="20" x2="50" y2="60" stroke="#00e5ff" strokeWidth="2.5" opacity="0.8" />
              <line x1="30" y1="45" x2="50" y2="60" stroke="#00e5ff" strokeWidth="2" opacity="0.6" />
              <line x1="70" y1="45" x2="50" y2="60" stroke="#00e5ff" strokeWidth="2" opacity="0.6" />
              {/* Glowing Red Eyes */}
              <ellipse cx="36" cy="48" rx="7" ry="4" fill="#ff003c" className="animate-pulse" />
              <ellipse cx="64" cy="48" rx="7" ry="4" fill="#ff003c" className="animate-pulse" />
              <circle cx="36" cy="48" r="1.8" fill="#ffffff" />
              <circle cx="64" cy="48" r="1.8" fill="#ffffff" />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
          </div>

          <div>
            <div className="font-['Orbitron'] font-black tracking-wider text-base sm:text-lg text-white leading-none">
              DJ CYBERPANTHER
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-['Orbitron'] font-bold text-[10px] tracking-widest text-[#ff003c] uppercase">
                ENERGY
              </span>
              <span className="text-[10px] text-white/40 font-mono">•</span>
              <span className="text-[10px] font-mono text-[#00e5ff] uppercase tracking-wide">
                DUO MIX 6-PACK
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-['Orbitron'] font-bold tracking-wider uppercase">
          <a 
            href="#duomix" 
            onClick={onNavigateHome}
            className="text-white/80 hover:text-[#00e5ff] transition-colors"
          >
            DUO MIX BOXEN
          </a>
          <a 
            href="#winter" 
            onClick={onNavigateHome}
            className="text-white/80 hover:text-[#ff003c] transition-colors"
          >
            WINTER EDITION
          </a>
          <a 
            href="#flavors" 
            onClick={onNavigateHome}
            className="text-white/80 hover:text-white transition-colors"
          >
            FLAVORS
          </a>
          <button 
            onClick={onNavigateAdmin}
            className="text-white/60 hover:text-[#00e5ff] font-mono text-[11px] px-2.5 py-1 rounded bg-[#131722] border border-[#232b3d] hover:border-[#00e5ff] transition-all"
          >
            ADMIN /ADMIN
          </button>
        </nav>

        {/* Right Action Icons: Cart & Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="relative px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#141824] to-[#1a2030] hover:from-[#1b2133] hover:to-[#222b40] border border-[#273247] hover:border-[#00e5ff]/60 text-white flex items-center gap-2.5 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] active:scale-95"
            aria-label="Warenkorb öffnen"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#00e5ff]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#ff003c] text-white font-['Orbitron'] font-black text-[10px] flex items-center justify-center shadow-[0_0_10px_#ff003c] animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-['Orbitron'] font-bold text-xs">
              WARENKORB
            </span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#141824] text-white/80 border border-[#222b3d]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1b2336] bg-[#0c0f16] px-5 py-4 space-y-3 font-['Orbitron'] text-xs font-bold uppercase">
          <a
            href="#duomix"
            onClick={() => { setMobileMenuOpen(false); onNavigateHome(); }}
            className="block py-2 text-white/90 hover:text-[#00e5ff]"
          >
            DUO MIX BOXEN (3.0L)
          </a>
          <a
            href="#winter"
            onClick={() => { setMobileMenuOpen(false); onNavigateHome(); }}
            className="block py-2 text-white/90 hover:text-[#ff003c]"
          >
            WINTER EDITION DOSEN
          </a>
          <a
            href="#flavors"
            onClick={() => { setMobileMenuOpen(false); onNavigateHome(); }}
            className="block py-2 text-white/90"
          >
            FLAVOR PROFILES
          </a>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigateAdmin(); }}
            className="w-full text-left py-2 text-[#00e5ff] font-mono text-xs"
          >
            ADMIN PANEL (/admin)
          </button>
        </div>
      )}
    </header>
  );
}
