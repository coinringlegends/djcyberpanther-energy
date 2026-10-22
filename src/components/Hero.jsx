import React, { useState, useEffect } from 'react';
import { ArrowRight, Volume2, VolumeX, Sparkles, ShieldCheck, Zap, Snowflake } from 'lucide-react';
import CyberAssetVisual from './CyberAssetVisual.jsx';

export default function Hero({ onShopNow, featuredProduct }) {
  const [soundActive, setSoundActive] = useState(false);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Subtle synth beat loop simulation for rave energy
  useEffect(() => {
    let audioCtx = null;
    let osc = null;
    let timer = null;

    if (soundActive) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        let step = 0;
        
        timer = setInterval(() => {
          if (!audioCtx) return;
          const now = audioCtx.currentTime;
          const oscNode = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          // Cyber rave sub-bass pulse: 55Hz (A1) then 65Hz
          oscNode.type = step % 4 === 0 ? 'sine' : 'triangle';
          oscNode.frequency.setValueAtTime(step % 4 === 0 ? 55 : 110, now);
          
          gainNode.gain.setValueAtTime(0.04, now);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
          
          oscNode.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          oscNode.start(now);
          oscNode.stop(now + 0.2);
          
          step++;
          setPulseIndex(step % 4);
        }, 300); // 133 BPM techno beat pulse
      } catch (e) {
        console.warn("WebAudio not enabled", e);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
      if (audioCtx) audioCtx.close();
    };
  }, [soundActive]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a] border-b border-[#1b2230]">
      {/* Background Cinematic Atmosphere: Northern Lights + Dark Pine Forest Silhouettes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dynamic Aurora Waves */}
        <div 
          className="absolute -top-32 left-1/4 w-[600px] h-[500px] rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse"
          style={{
            background: 'radial-gradient(circle, #00e5ff 0%, #0a3d1f 60%, transparent 80%)',
            animationDuration: '8s'
          }}
        />
        <div 
          className="absolute top-1/3 -right-20 w-[500px] h-[450px] rounded-full blur-[130px] opacity-35 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, #ff003c 0%, #3a001a 50%, transparent 75%)'
          }}
        />

        {/* Cyberpunk Grid Horizon Lines */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, #00e5ff 1px, transparent 1px), linear-gradient(to bottom, #00e5ff 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            transform: 'perspective(600px) rotateX(60deg) translateY(200px)'
          }}
        />

        {/* Forest Pine Trees Silhouette at bottom */}
        <svg 
          viewBox="0 0 1440 260" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 w-full h-44 text-[#06080c] fill-current opacity-90"
        >
          <path d="M0,260 L0,180 L40,110 L50,140 L80,90 L90,120 L130,60 L140,100 L180,50 L200,90 L240,40 L260,80 L300,30 L320,70 L380,20 L400,60 L450,15 L470,55 L520,35 L550,75 L600,25 L630,70 L680,10 L700,50 L750,30 L780,75 L840,15 L870,60 L920,40 L950,85 L1010,20 L1030,65 L1080,35 L1120,80 L1180,10 L1200,60 L1260,30 L1290,75 L1350,20 L1380,65 L1440,40 L1440,260 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Brand Copy & Actions */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Neon Chip Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121620]/90 border border-[#00e5ff]/50 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#ff003c] animate-ping" />
            <span className="font-mono text-xs font-bold text-[#00e5ff] tracking-widest uppercase">
              CYBERPUNK x WINTER x FOREST RAVE
            </span>
          </div>

          <h1 className="font-['Orbitron'] font-black tracking-tight text-4xl sm:text-6xl xl:text-7xl leading-none">
            <span className="text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] block">
              DJ CYBERPANTHER
            </span>
            <span className="bg-gradient-to-r from-[#ff003c] via-[#f5f5f5] to-[#00e5ff] bg-clip-text text-transparent block mt-1 drop-shadow-[0_0_30px_rgba(255,0,60,0.5)]">
              ENERGY
            </span>
          </h1>

          <p className="text-zinc-300 font-['Rajdhani'] font-semibold text-lg sm:text-2xl max-w-2xl mx-auto lg:mx-0 leading-relaxed tracking-wide">
            Gefrorener Tannenwald, glühende Nordlichter und der Bass einer eisigen Winternacht. 
            Entdecke unsere <strong className="text-[#00e5ff]">DUO MIX 6-Pack Boxen (6x 500ml / 3.0L)</strong> und eisgekühlten Winter Edition Dosen.
          </p>

          {/* Key Brand Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e131d] border border-white/10 text-xs font-mono text-zinc-300">
              <Zap className="w-4 h-4 text-[#00e5ff]" />
              <span>32mg/100ml Koffein + Taurin</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e131d] border border-white/10 text-xs font-mono text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-[#ff003c]" />
              <span>100% SUGAR FREE (0g Zucker)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e131d] border border-white/10 text-xs font-mono text-zinc-300">
              <Snowflake className="w-4 h-4 text-[#00e5ff]" />
              <span>Swiss Engineered & Bottled</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={onShopNow}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff003c] to-[#e60035] hover:from-[#e60035] hover:to-[#ff1a4f] text-white font-['Orbitron'] font-black text-base tracking-wider uppercase shadow-[0_0_25px_rgba(255,0,60,0.5)] hover:shadow-[0_0_35px_rgba(255,0,60,0.8)] transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            <a
              href="#duo-mix"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#121620] hover:bg-[#181e2b] border border-[#00e5ff]/50 hover:border-[#00e5ff] text-[#00e5ff] font-['Orbitron'] font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.15)] active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#00e5ff]" />
              <span>DUO MIX BOXEN (3L)</span>
            </a>

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={() => setSoundActive(!soundActive)}
              className="px-4 py-4 rounded-xl bg-[#0e121a] border border-white/10 hover:border-[#00e5ff]/50 text-zinc-400 hover:text-[#00e5ff] transition-all flex items-center justify-center"
              title={soundActive ? "Forest Rave Beats pausieren" : "Forest Rave Beat aktivieren"}
            >
              {soundActive ? (
                <div className="flex items-center gap-2 text-xs font-mono text-[#00e5ff]">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span className="hidden sm:inline">133 BPM RAVE</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">SOUND</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: 3D Box & Can Showcase with Rim Lights */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[460px] aspect-square rounded-2xl p-2 bg-gradient-to-b from-[#141a24]/60 to-transparent border border-white/10 backdrop-blur-sm shadow-[0_25px_60px_rgba(0,0,0,0.9)] group">
            {/* Ambient Panther Eyes Flare */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-10 bg-[#ff003c]/20 blur-xl pointer-events-none" />

            <CyberAssetVisual 
              product={featuredProduct}
              viewMode="box"
              className="w-full h-full transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
