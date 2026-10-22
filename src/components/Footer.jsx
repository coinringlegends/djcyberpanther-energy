import React from 'react';
import { Sparkles, ShieldCheck, Instagram, Music, Radio, Heart } from 'lucide-react';

export default function Footer({ onNavigateAdmin }) {
  return (
    <footer className="relative bg-[#06080c] border-t border-[#182030] text-[#f5f5f5] pt-16 pb-12 overflow-hidden">
      {/* Aurora Ambient light */}
      <div 
        className="absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #00e5ff 0%, #0a3d1f 60%, transparent 80%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0e121a] border border-[#00e5ff]/50 flex items-center justify-center p-1.5 shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
                  <polygon points="50,15 15,40 25,75 50,92 75,75 85,40" fill="#050608" stroke="#00e5ff" strokeWidth="4" />
                  <ellipse cx="38" cy="46" rx="6" ry="3" fill="#ff003c" />
                  <ellipse cx="62" cy="46" rx="6" ry="3" fill="#ff003c" />
                </svg>
              </div>
              <span className="font-['Orbitron'] font-black text-lg text-white tracking-wider">
                DJ CYBERPANTHER
              </span>
            </div>

            <p className="text-zinc-400 font-['Rajdhani'] font-medium text-sm leading-relaxed">
              Die Symbiose aus Cyberpunk, gefrorenem Schweizer Tannenwald und energiegeladenem Winter-Rave. 
              100% zuckerfrei, maximal fokussiert.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-xl bg-[#111624] border border-white/10 hover:border-[#00e5ff] text-zinc-400 hover:text-[#00e5ff] flex items-center justify-center transition-colors"
                title="Instagram @djcyberpanther"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-xl bg-[#111624] border border-white/10 hover:border-[#ff003c] text-zinc-400 hover:text-[#ff003c] flex items-center justify-center transition-colors"
                title="TikTok @djcyberpanther"
              >
                <Music className="w-4 h-4" />
              </a>
              <a 
                href="https://soundcloud.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-xl bg-[#111624] border border-white/10 hover:border-[#00e5ff] text-zinc-400 hover:text-[#00e5ff] flex items-center justify-center transition-colors"
                title="SoundCloud Live Sets"
              >
                <Radio className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Flavors Col */}
          <div className="space-y-3 text-xs font-mono">
            <span className="font-['Orbitron'] font-bold text-sm text-white block tracking-wider">
              OFFIZIELLE FLAVORS
            </span>
            <ul className="space-y-2 text-zinc-400">
              <li className="hover:text-[#00e5ff] transition-colors cursor-default">🌲 TANNENZAUBER (Pine Cranberry)</li>
              <li className="hover:text-[#ff003c] transition-colors cursor-default">⭐ ZIMTSTERN NEBEL (Gingerbread Vanilla)</li>
              <li className="hover:text-amber-400 transition-colors cursor-default">☕ PUNSCH COFFEE (Coffee Orange)</li>
              <li className="hover:text-[#00e5ff] transition-colors cursor-default">🌌 NORDLICHT PUNSCH (Arctic Berry)</li>
              <li className="hover:text-[#ff003c] transition-colors cursor-default">🥤 ZIMT COLA (Spiced Cyber Cola)</li>
              <li className="hover:text-cyan-300 transition-colors cursor-default">❄️ VANILLE SCHNEE X (Bourbon Ice)</li>
            </ul>
          </div>

          {/* Service & Order Col */}
          <div className="space-y-3 text-xs font-mono">
            <span className="font-['Orbitron'] font-bold text-sm text-white block tracking-wider">
              BESTELLUNG & ZAHLUNG
            </span>
            <ul className="space-y-2 text-zinc-400">
              <li>• TWINT Zahlung an 076 322 79 81</li>
              <li>• WhatsApp Direkt-Bestellung an 079 833 93 87</li>
              <li>• Calmebot API Dispatch</li>
              <li>• Versand via Swiss Post (1-2 Werktage)</li>
              <li>• Ab CHF 50.- portofrei</li>
            </ul>
          </div>

          {/* Admin & Legal */}
          <div className="space-y-3 text-xs font-mono">
            <span className="font-['Orbitron'] font-bold text-sm text-white block tracking-wider">
              SYSTEM & CONTROL
            </span>
            <p className="text-zinc-500">
              Erhöhter Koffeingehalt (32mg/100ml). Für Kinder und schwangere oder stillende Frauen nicht empfohlen.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateAdmin}
                className="px-3.5 py-2 rounded-xl bg-[#141b29] hover:bg-[#1e283d] text-[#ff003c] border border-[#ff003c]/40 transition-colors flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Admin Login (/admin)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} DJ CYBERPANTHER ENERGY. Alle Rechte vorbehalten.</p>
          <p className="flex items-center gap-1">
            <span>Made with cold forest energy & bass in Switzerland</span>
            <span className="text-[#ff003c]">🇨🇭</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
