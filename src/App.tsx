import React, { useState, useEffect } from 'react';
import { 
  collection, onSnapshot, doc, setDoc, getDocFromServer 
} from 'firebase/firestore';
import { db, isFirebaseConnected, handleFirestoreError } from './firebaseConfig.ts';
import { INITIAL_PRODUCTS } from './data/products.js';
import FallingSnow from './components/FallingSnow.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ProductCard from './components/ProductCard.jsx';
import ProductDetailModal from './components/ProductDetailModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Checkout from './components/Checkout.jsx';
import Admin from './pages/Admin.jsx';
import Footer from './components/Footer.jsx';
import { Sparkles, Layers, Box as BoxIcon, Filter, Zap, Snowflake } from 'lucide-react';

export default function App() {
  // Navigation: 'shop' or 'admin'
  const [currentView, setCurrentView] = useState<'shop' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('admin') || hash.includes('admin')) {
        return 'admin';
      }
    }
    return 'shop';
  });

  // Products state (synced live with Firestore)
  const [products, setProducts] = useState<any[]>(INITIAL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Selected product for detail modal
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Cart state with localStorage persistence
  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('dj_cyberpanther_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Test connection to Firestore on boot (required by Firebase skill)
  useEffect(() => {
    async function testConnection() {
      if (!db) return;
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn('Firebase client offline, check configuration.');
        }
      }
    }
    testConnection();
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dj_cyberpanther_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  // Handle URL hash changes for `/admin` routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('admin')) {
        setCurrentView('admin');
      } else if (currentView === 'admin' && !hash.includes('admin')) {
        setCurrentView('shop');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  // LIVE Firestore onSnapshot for Products
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let hasSeeded = false;

    try {
      if (db) {
        const prodRef = collection(db, 'products');
        unsubscribe = onSnapshot(prodRef, async (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setProducts(fetched);
          } else {
            setProducts(INITIAL_PRODUCTS);
            // Auto seed to Firestore if collection is empty
            if (!hasSeeded) {
              hasSeeded = true;
              try {
                for (const item of INITIAL_PRODUCTS) {
                  await setDoc(doc(db, 'products', item.id), {
                    ...item,
                    createdAt: new Date().toISOString()
                  });
                }
              } catch (seedErr) {
                console.warn('Auto-seed products note:', seedErr);
              }
            }
          }
        }, (error) => {
          handleFirestoreError(error, 'list', 'products');
          setProducts(INITIAL_PRODUCTS);
        });
      }
    } catch (err) {
      console.warn("Firestore live listener init:", err);
      setProducts(INITIAL_PRODUCTS);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Cart actions
  const handleAddToCart = (product: any, quantity: number = 1) => {
    setCartItems((prev: any[]) => {
      const existing = prev.find((item: any) => item.id === product.id);
      if (existing) {
        return prev.map((item: any) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev: any[]) =>
      prev.map((item: any) => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev: any[]) => prev.filter((item: any) => item.id !== id));
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  // Filter products by category
  const filteredProducts = products.filter((p: any) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'DUO_MIX') return p.isBox || p.category === 'Duo Mix';
    if (activeCategory === 'WINTER_EDITION') return !p.isBox || p.category === 'Winter Edition';
    return true;
  });

  // Featured product for Hero
  const featuredProduct = products.find((p: any) => p.isBox) || products[0] || INITIAL_PRODUCTS[0];

  // If viewing admin panel
  if (currentView === 'admin') {
    return (
      <Admin 
        onBackToShop={() => {
          window.location.hash = '';
          setCurrentView('shop');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] selection:bg-[#ff003c] selection:text-white relative">
      {/* Falling Snow Particle Layer */}
      <FallingSnow />

      {/* Main Navbar */}
      <Navbar 
        cartCount={cartItems.reduce((acc: number, i: any) => acc + (i.quantity || 1), 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={(view: string) => {
          if (view === 'admin') window.location.hash = 'admin';
          setCurrentView(view as 'shop' | 'admin');
        }}
        currentView={currentView}
      />

      {/* Hero Section */}
      <Hero 
        onShopNow={() => {
          const el = document.getElementById('products-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        featuredProduct={featuredProduct}
      />

      {/* Main Catalog Section */}
      <main id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1c2436] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00e5ff] tracking-widest uppercase mb-1">
              <Snowflake className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              <span>COLD FOREST COLLECTION</span>
            </div>
            <h2 className="font-['Orbitron'] font-black text-3xl sm:text-4xl text-white">
              DUO MIX BOXEN & DOSEN
            </h2>
            <p className="text-zinc-400 font-['Rajdhani'] font-medium text-base mt-1">
              Mit und ohne Verpackung im 3D Viewer erlebbar. Alle Flavors 100% zuckerfrei.
            </p>
          </div>

          {/* Filter Pill Buttons */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0f131c] border border-white/10 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-4 py-2 rounded-xl font-['Rajdhani'] font-bold text-xs uppercase tracking-wider transition-all shrink-0 ${
                activeCategory === 'ALL'
                  ? 'bg-[#00e5ff] text-black shadow-[0_0_12px_#00e5ff]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ALLE PRODUKTE ({products.length})
            </button>
            <button
              onClick={() => setActiveCategory('DUO_MIX')}
              className={`px-4 py-2 rounded-xl font-['Rajdhani'] font-bold text-xs uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'DUO_MIX'
                  ? 'bg-[#ff003c] text-white shadow-[0_0_12px_#ff003c]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BoxIcon className="w-3.5 h-3.5" />
              <span>DUO MIX BOXEN (3L)</span>
            </button>
            <button
              onClick={() => setActiveCategory('WINTER_EDITION')}
              className={`px-4 py-2 rounded-xl font-['Rajdhani'] font-bold text-xs uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'WINTER_EDITION'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_#9333ea]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>DOSEN 500ML</span>
            </button>
          </div>
        </div>

        {/* Highlight Banner: 3D Box & Can toggle instruction */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0a3d1f]/40 via-[#0e1624] to-[#ff003c]/20 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00e5ff]/20 text-[#00e5ff]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block">INTERAKTIVE 3D DUAL-ANSICHT VERFÜGBAR</span>
              <span className="text-zinc-400">
                Nutze den Umschalter auf jeder Box: <strong>[BOX]</strong> = Mit Verpackung • <strong>[SCHNEE]</strong> = 2 Dosen im Schnee
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-black/60 text-[#00e5ff] border border-[#00e5ff]/30 text-[11px] font-bold shrink-0">
            SWISS QUALITY TAURIN + GUARANA
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={(prod: any) => setSelectedProduct(prod)}
            />
          ))}
        </div>
      </main>

      {/* Flavor Matrix Section */}
      <section id="flavors" className="bg-[#07090e] border-t border-[#182030] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#ff003c] tracking-widest uppercase">
              DIE OFFIZIELLEN FLAVORS
            </span>
            <h2 className="font-['Orbitron'] font-black text-3xl sm:text-4xl text-white">
              CYBERPANTHER AROMEN-EXPLOSION
            </h2>
            <p className="text-zinc-400 font-['Rajdhani'] font-medium text-base">
              Geschaffen für lange Raves im gefrorenen Winterwald. Alle Dosen mit 32mg Koffein pro 100ml.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0c1018] border border-[#0a3d1f]/60 hover:border-[#0a3d1f] transition-colors space-y-3">
              <span className="text-2xl">🌲</span>
              <h3 className="font-['Orbitron'] font-bold text-lg text-emerald-400">TANNENZAUBER</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Frische Nadelwald-Aromen, Kiefernholz und spritzige Alpen-Cranberrys. Der unverkennbare Signature Forest Drink.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1018] border border-amber-600/40 hover:border-amber-500 transition-colors space-y-3">
              <span className="text-2xl">⭐</span>
              <h3 className="font-['Orbitron'] font-bold text-lg text-amber-400">ZIMTSTERN NEBEL</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Schweizer Zimtstern trifft samtigen Lebkuchen, geröstete Mandeln und edle Bourbon-Vanille.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1018] border border-orange-600/40 hover:border-orange-500 transition-colors space-y-3">
              <span className="text-2xl">☕</span>
              <h3 className="font-['Orbitron'] font-bold text-lg text-orange-400">PUNSCH COFFEE</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Cold Brew Kaffee-Röstung gepaart mit traditionellem Winterpunsch, Zimtrinde und karamellisierter Blutorange.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1018] border border-[#00e5ff]/40 hover:border-[#00e5ff] transition-colors space-y-3">
              <span className="text-2xl">🌌</span>
              <h3 className="font-['Orbitron'] font-bold text-lg text-[#00e5ff]">NORDLICHT PUNSCH</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Arktische Waldbeeren, Preiselbeeren und eisige Zitrusfrische unter den tanzenden Polarlichtern des Nordens.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1018] border border-[#ff003c]/40 hover:border-[#ff003c] transition-colors space-y-3">
              <span className="text-2xl">🥤</span>
              <h3 className="font-['Orbitron'] font-bold text-lg text-[#ff003c]">ZIMT COLA</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Dunkle Cyber-Cola mit prickelnder Kolanuss und brennendem Ceylon-Zimt. Brachial erfrischend.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1018] border border-cyan-400/40 hover:border-cyan-300 transition-colors space-y-3">
              <span className="text-2xl">❄️</span>
              <h3 className="font-['Orbitron'] font-bold text-lg text-cyan-300">VANILLE SCHNEE X</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Kristalliner Vanille-Schneesturm auf Crushed Ice. Samtiger Abgang, maximaler Fokus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Footer */}
      <Footer onNavigateAdmin={() => {
        window.location.hash = 'admin';
        setCurrentView('admin');
      }} />
    </div>
  );
}
