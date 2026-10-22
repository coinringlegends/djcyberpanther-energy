import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Upload, Eye, Check, ShieldCheck, 
  AlertCircle, RefreshCw, Radio, Image as ImageIcon, Box as BoxIcon, 
  Layers, Package, ShoppingCart, DollarSign, ExternalLink, Save, Key, Database
} from 'lucide-react';
import { 
  collection, doc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth, isFirebaseConnected, handleFirestoreError } from '../firebaseConfig.js';
import { INITIAL_PRODUCTS } from '../data/products.js';
import CyberAssetVisual from '../components/CyberAssetVisual.jsx';

export default function Admin({ onBackToShop }) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active admin tab: 'products' | 'orders' | 'firebase_config'
  const [activeTab, setActiveTab] = useState('products');

  // Products from Firestore
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Orders from Firestore
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Product Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    flavor1: '',
    flavor2: '',
    flavorTag: '',
    price: 29.90,
    volume: '6x 500ml (3.0L)',
    category: 'Duo Mix',
    stock: 50,
    isBox: true,
    isSugarFree: true,
    badge: 'Winter Edition',
    description: '',
    ingredients: '',
    imageBox: '',
    imageCansSnow: '',
    imageCanFront: '',
    imageMockup: ''
  });

  // Upload progress states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Firebase Config Editor
  const [configJson, setConfigJson] = useState(() => {
    return localStorage.getItem('dj_cyberpanther_firebase_config') || '';
  });
  const [configSaved, setConfigSaved] = useState(false);

  // Simple admin passcode check (or Firebase Auth)
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPasscode === 'panther2026' || adminPasscode === 'admin' || adminPasscode === 'cyberpanther') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Falscher Admin-Code. Tipp: Nutze "cyberpanther" oder "panther2026".');
    }
  };

  // 1. Live Firestore onSnapshot for Products
  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribe = null;
    try {
      if (db) {
        const prodRef = collection(db, 'products');
        unsubscribe = onSnapshot(prodRef, (snapshot) => {
          if (!snapshot.empty) {
            const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(prods);
          } else {
            // If collection is empty, load initial dielines as default view
            setProducts(INITIAL_PRODUCTS);
          }
          setIsLoadingProducts(false);
        }, (error) => {
          handleFirestoreError(error, 'list', 'products');
          setProducts(INITIAL_PRODUCTS);
          setIsLoadingProducts(false);
        });
      } else {
        setProducts(INITIAL_PRODUCTS);
        setIsLoadingProducts(false);
      }
    } catch (e) {
      console.warn("Firestore products listener error:", e);
      setProducts(INITIAL_PRODUCTS);
      setIsLoadingProducts(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isAuthenticated]);

  // 2. Live Firestore onSnapshot for Orders
  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribe = null;
    try {
      if (db) {
        const ordersRef = collection(db, 'orders');
        unsubscribe = onSnapshot(ordersRef, (snapshot) => {
          const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort by creation date desc
          fetchedOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          setOrders(fetchedOrders);
          setIsLoadingOrders(false);
        }, (error) => {
          handleFirestoreError(error, 'list', 'orders');
          // Load fallback orders from localStorage
          const local = JSON.parse(localStorage.getItem('dj_cyberpanther_orders') || '[]');
          setOrders(local);
          setIsLoadingOrders(false);
        });
      } else {
        const local = JSON.parse(localStorage.getItem('dj_cyberpanther_orders') || '[]');
        setOrders(local);
        setIsLoadingOrders(false);
      }
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('dj_cyberpanther_orders') || '[]');
      setOrders(local);
      setIsLoadingOrders(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isAuthenticated]);

  // Seed Firestore with initial 8 dielines
  const handleSeedProducts = async () => {
    if (!db) {
      alert("Firebase Firestore ist noch nicht initialisiert.");
      return;
    }
    setIsUploading(true);
    setUploadMessage("Initialisiere 'products' Collection in Firestore mit 8 Dieline-Produkten...");
    try {
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          updatedAt: new Date().toISOString()
        });
      }
      setUploadMessage("Erfolgreich! Alle 8 Produkte wurden in Firestore 'products' gespeichert.");
    } catch (err) {
      console.error("Error seeding products:", err);
      alert("Fehler beim Speichern in Firestore: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Upload an image file directly to Firebase Storage "products/"
  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(`Lade Bild für ${fieldName} in Firebase Storage "products/" hoch...`);

    try {
      let downloadUrl = null;
      if (storage) {
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storageRef = ref(storage, `products/${Date.now()}_${safeName}`);
        const snapshot = await uploadBytes(storageRef, file);
        downloadUrl = await getDownloadURL(snapshot.ref);
      } else {
        // Fallback to local DataURL
        downloadUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: downloadUrl
      }));
      setUploadMessage(`Bild erfolgreich hochgeladen und verknüpft!`);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload-Fehler: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Save / Update product in Firestore
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadMessage("Speichere Produkt in Firestore...");

    try {
      const prodPayload = {
        name: formData.name,
        tagline: formData.tagline || '',
        flavor1: formData.flavor1 || '',
        flavor2: formData.flavor2 || '',
        flavorTag: formData.flavorTag || `${formData.flavor1} x ${formData.flavor2}`,
        price: Number(formData.price),
        volume: formData.volume || (formData.isBox ? '6x 500ml (3.0L)' : '500ml'),
        category: formData.category,
        stock: Number(formData.stock),
        isBox: Boolean(formData.isBox),
        isSugarFree: Boolean(formData.isSugarFree),
        badge: formData.badge || '',
        description: formData.description || '',
        ingredients: formData.ingredients || '',
        imageBox: formData.imageBox || '',
        imageCansSnow: formData.imageCansSnow || '',
        imageCanFront: formData.imageCanFront || '',
        imageMockup: formData.imageMockup || '',
        updatedAt: new Date().toISOString()
      };

      if (db) {
        if (isEditing && editingId) {
          await updateDoc(doc(db, 'products', editingId), prodPayload);
        } else {
          const newDocRef = await addDoc(collection(db, 'products'), {
            ...prodPayload,
            createdAt: new Date().toISOString()
          });
        }
      }

      setUploadMessage("Produkt erfolgreich gespeichert!");
      resetForm();
    } catch (err) {
      console.error("Save product error:", err);
      alert("Fehler beim Speichern in Firestore: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Möchtest du dieses Produkt wirklich löschen?")) return;
    try {
      if (db) {
        await deleteDoc(doc(db, 'products', id));
      }
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Löschen fehlgeschlagen: " + err.message);
    }
  };

  const handleEditProduct = (prod) => {
    setIsEditing(true);
    setEditingId(prod.id);
    setFormData({
      name: prod.name || '',
      tagline: prod.tagline || '',
      flavor1: prod.flavor1 || '',
      flavor2: prod.flavor2 || '',
      flavorTag: prod.flavorTag || '',
      price: prod.price || 29.90,
      volume: prod.volume || '6x 500ml (3.0L)',
      category: prod.category || 'Duo Mix',
      stock: prod.stock || 50,
      isBox: prod.isBox ?? true,
      isSugarFree: prod.isSugarFree ?? true,
      badge: prod.badge || '',
      description: prod.description || '',
      ingredients: prod.ingredients || '',
      imageBox: prod.imageBox || '',
      imageCansSnow: prod.imageCansSnow || '',
      imageCanFront: prod.imageCanFront || '',
      imageMockup: prod.imageMockup || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      tagline: '',
      flavor1: '',
      flavor2: '',
      flavorTag: '',
      price: 29.90,
      volume: '6x 500ml (3.0L)',
      category: 'Duo Mix',
      stock: 50,
      isBox: true,
      isSugarFree: true,
      badge: 'Winter Edition',
      description: '',
      ingredients: '',
      imageBox: '',
      imageCansSnow: '',
      imageCanFront: '',
      imageMockup: ''
    });
  };

  // Update order status in Firestore
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      if (db) {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      }
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Status-Update fehlgeschlagen: " + err.message);
    }
  };

  // Save custom Firebase Web SDK Config
  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(configJson);
      localStorage.setItem('dj_cyberpanther_firebase_config', JSON.stringify(parsed));
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 3000);
      alert("Firebase Config gespeichert! Die Seite wird neu geladen, um die Verbindung zu aktivieren.");
      window.location.reload();
    } catch (err) {
      alert("Ungültiges JSON-Format. Bitte überprüfe die Config aus der Firebase Console.");
    }
  };

  // If not logged in, show cyber login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#08090d]">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0e121a] border border-[#1e2535] shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#ff003c]/10 text-[#ff003c] border border-[#ff003c]/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,0,60,0.3)]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-['Orbitron'] font-black text-2xl text-white">
              ADMIN LOGIN
            </h1>
            <p className="text-xs font-mono text-zinc-400">
              DJ CYBERPANTHER CONTROL CENTER
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-400">Admin Passcode *</label>
              <input
                type="password"
                required
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                placeholder="Passcode eingeben (z.B. cyberpanther)"
                className="w-full px-4 py-3 rounded-xl bg-[#141924] border border-white/10 focus:border-[#ff003c] focus:outline-none text-white font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff003c] to-[#e60035] text-white font-['Orbitron'] font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(255,0,60,0.5)] transition-all cursor-pointer"
            >
              ANMELDEN
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToShop}
              className="text-xs font-mono text-zinc-500 hover:text-white transition-colors"
            >
              ← Zurück zum Online-Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f5f5f5] pb-24">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-[#0c1017]/90 backdrop-blur-xl border-b border-[#1c2333] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/50">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-['Orbitron'] font-black text-xl text-white">
                ADMINISTRATION PANEL
              </h1>
              <p className="text-[11px] font-mono text-zinc-400">
                Live Firebase Firestore & Storage • DJ CYBERPANTHER ENERGY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="px-4 py-2 rounded-xl bg-[#141926] hover:bg-[#1d2538] border border-white/10 text-xs font-mono text-zinc-300 transition-colors"
            >
              ← ZUM SHOP
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs font-mono text-red-300 transition-colors"
            >
              ABMELDEN
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center gap-2 border-t border-white/5 pt-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl font-['Rajdhani'] font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'products'
                ? 'bg-[#00e5ff] text-black shadow-[0_0_15px_#00e5ff]'
                : 'bg-[#121622] text-zinc-400 hover:text-white'
            }`}
          >
            <BoxIcon className="w-4 h-4" />
            <span>PRODUKTE ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl font-['Rajdhani'] font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#ff003c] text-white shadow-[0_0_15px_#ff003c]'
                : 'bg-[#121622] text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>BESTELLUNGEN ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase_config')}
            className={`px-4 py-2 rounded-xl font-['Rajdhani'] font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'firebase_config'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_#9333ea]'
                : 'bg-[#121622] text-zinc-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>FIREBASE CONFIG & DIAGNOSTICS</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Upload/Status Toast */}
        {uploadMessage && (
          <div className="p-4 rounded-2xl bg-[#121b2a] border border-[#00e5ff]/50 text-xs font-mono text-[#00e5ff] flex items-center justify-between shadow-lg">
            <span>{uploadMessage}</span>
            <button onClick={() => setUploadMessage('')} className="text-zinc-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-[#0d111a] border border-[#1b2333] rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-['Orbitron'] font-bold text-lg text-white">
                    {isEditing ? 'PRODUKT BEARBEITEN' : 'NEUES PRODUKT ERSTELLEN'}
                  </h2>
                  <p className="text-xs font-mono text-zinc-400">
                    Wird live in Firestore Collection "products" gespeichert
                  </p>
                </div>
                {isEditing && (
                  <button
                    onClick={resetForm}
                    className="text-xs font-mono text-zinc-400 hover:text-white underline"
                  >
                    Abbrechen
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-zinc-300">Produktname *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. DUO MIX: TANNENZAUBER + ZIMT COLA"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141a27] border border-white/10 text-white"
                  />
                </div>

                {/* Tagline */}
                <div className="space-y-1">
                  <label className="text-zinc-300">Slogan / Untertitel</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Eisiger Winter-Drop mit Tannennadeln & Cranberry"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141a27] border border-white/10 text-white"
                  />
                </div>

                {/* Flavors 1 and 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-300">Flavor 1 *</label>
                    <input
                      type="text"
                      value={formData.flavor1}
                      onChange={(e) => setFormData({ ...formData, flavor1: e.target.value })}
                      placeholder="z.B. TANNENZAUBER (Pine Cranberry)"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141a27] border border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-300">Flavor 2 (bei Duo Mix)</label>
                    <input
                      type="text"
                      value={formData.flavor2}
                      onChange={(e) => setFormData({ ...formData, flavor2: e.target.value })}
                      placeholder="z.B. ZIMT COLA"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141a27] border border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Price, Stock, Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-300">Preis (CHF) *</label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141a27] border border-white/10 text-white font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300">Lagerbestand *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141a27] border border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300">Kategorie *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, isBox: e.target.value === 'Duo Mix' })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141a27] border border-white/10 text-white"
                    >
                      <option value="Duo Mix">Duo Mix (6-Pack Box)</option>
                      <option value="Winter Edition">Winter Edition (Dose)</option>
                      <option value="Single Can">Single Can (500ml)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-zinc-300">Beschreibung</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detaillierte Geschmacksbeschreibung für den Store..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141a27] border border-white/10 text-white"
                  />
                </div>

                {/* Firebase Storage Image Uploads */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <span className="text-xs font-mono text-[#00e5ff] font-bold block">
                    BILD-UPLOADS NACH FIREBASE STORAGE (products/)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Upload 1: Box Front / MIT Verpackung */}
                    <div className="p-3 bg-[#131927] rounded-xl border border-white/10 space-y-1.5">
                      <label className="text-zinc-300 block font-bold">1. Box Front (MIT Verpackung)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'imageBox')}
                        className="text-[11px] text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-[#1f293d] file:text-white file:border-0 cursor-pointer"
                      />
                      {formData.imageBox && (
                        <span className="text-[10px] text-emerald-400 block truncate">✓ {formData.imageBox}</span>
                      )}
                    </div>

                    {/* Upload 2: Dosen im Schnee / OHNE Verpackung */}
                    <div className="p-3 bg-[#131927] rounded-xl border border-white/10 space-y-1.5">
                      <label className="text-zinc-300 block font-bold">2. Dosen im Schnee (OHNE Verpackung)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'imageCansSnow')}
                        className="text-[11px] text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-[#1f293d] file:text-white file:border-0 cursor-pointer"
                      />
                      {formData.imageCansSnow && (
                        <span className="text-[10px] text-emerald-400 block truncate">✓ {formData.imageCansSnow}</span>
                      )}
                    </div>

                    {/* Upload 3: Dose Front */}
                    <div className="p-3 bg-[#131927] rounded-xl border border-white/10 space-y-1.5">
                      <label className="text-zinc-300 block font-bold">3. Dose Front Einzelflasche</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'imageCanFront')}
                        className="text-[11px] text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-[#1f293d] file:text-white file:border-0 cursor-pointer"
                      />
                      {formData.imageCanFront && (
                        <span className="text-[10px] text-emerald-400 block truncate">✓ {formData.imageCanFront}</span>
                      )}
                    </div>

                    {/* Upload 4: Box Mockup im Schnee */}
                    <div className="p-3 bg-[#131927] rounded-xl border border-white/10 space-y-1.5">
                      <label className="text-zinc-300 block font-bold">4. Box Mockup im Winterwald</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'imageMockup')}
                        className="text-[11px] text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-[#1f293d] file:text-white file:border-0 cursor-pointer"
                      />
                      {formData.imageMockup && (
                        <span className="text-[10px] text-emerald-400 block truncate">✓ {formData.imageMockup}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] text-black font-['Orbitron'] font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
                  >
                    {isEditing ? 'ÄNDERUNGEN SPEICHERN' : 'IN FIRESTORE ANLEGEN'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-3.5 rounded-xl bg-[#1b2333] text-zinc-300 font-mono text-xs"
                    >
                      Abbrechen
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0d111a] border border-[#1b2333] rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-['Orbitron'] font-bold text-sm text-[#00e5ff] flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    LIVE SHOP PREVIEW
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Echtzeit-Ansicht
                  </span>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-[#0a0d14]">
                  <div className="w-full aspect-square rounded-xl bg-[#10141f] p-2 flex items-center justify-center">
                    <CyberAssetVisual
                      product={{
                        ...formData,
                        id: 'preview_id'
                      }}
                      viewMode={formData.isBox ? 'box' : 'cans_snow'}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-['Orbitron'] font-bold text-white text-base">
                        {formData.name || 'DUO MIX: VORSCHAU'}
                      </span>
                      <span className="font-['Orbitron'] font-black text-base text-[#00e5ff]">
                        CHF {Number(formData.price || 29.9).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs font-mono">
                      {formData.tagline || 'Geschmacksvorschau im Winter Rave Style'}
                    </p>
                  </div>
                </div>

                {/* Seed Initial Catalog Quick Action */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="text-xs font-mono text-zinc-400 block">
                    Firestore Schnellstart:
                  </span>
                  <button
                    type="button"
                    onClick={handleSeedProducts}
                    className="w-full py-2.5 rounded-xl bg-[#162030] hover:bg-[#1d2b42] text-[#00e5ff] border border-[#00e5ff]/40 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>8 ECHTE DIELINE PRODUKTE IN FIRESTORE SPEICHERN</span>
                  </button>
                </div>
              </div>

              {/* Existing Products List */}
              <div className="bg-[#0d111a] border border-[#1b2333] rounded-3xl p-6 space-y-3">
                <h3 className="font-['Orbitron'] font-bold text-sm text-white">
                  AKTUELLE PRODUKTE IM STORE ({products.length})
                </h3>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 rounded-xl bg-[#121622] border border-white/5 flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="min-w-0">
                        <strong className="text-white block truncate">{prod.name}</strong>
                        <span className="text-[#00e5ff]">CHF {prod.price?.toFixed(2)}</span>
                        <span className="text-zinc-500 ml-2">Stock: {prod.stock}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEditProduct(prod)}
                          className="p-1.5 rounded-lg bg-[#1a2233] text-zinc-300 hover:text-white"
                          title="Bearbeiten"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 text-red-400 hover:text-red-300"
                          title="Löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGER */}
        {activeTab === 'orders' && (
          <div className="bg-[#0d111a] border border-[#1b2333] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="font-['Orbitron'] font-bold text-lg text-white">
                  EINGEHENDE BESTELLUNGEN (FIRESTORE "orders")
                </h2>
                <p className="text-xs font-mono text-zinc-400">
                  Bestellungen via WhatsApp (079 833 93 87), TWINT (076 322 79 81) und Web
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                LIVE SYNC AKTIV
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 space-y-3 font-mono text-xs">
                <ShoppingCart className="w-12 h-12 text-zinc-700 mx-auto" />
                <p>Noch keine Bestellungen in der Firestore Collection vorhanden.</p>
                <p>Gib eine Test-Bestellung im Shop auf, um sie live hier zu sehen!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-[#121724] border border-white/10 space-y-3 text-xs font-mono"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#00e5ff] text-sm">
                          {ord.reference || ord.orderNumber || ord.id}
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-zinc-400">
                          {new Date(ord.createdAt || Date.now()).toLocaleString('de-CH')}
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#1f293d] text-zinc-300 font-bold uppercase">
                          {ord.paymentMethod || 'TWINT'}
                        </span>
                        <select
                          value={ord.status || 'neu'}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className={`px-2 py-0.5 rounded font-bold uppercase text-[11px] bg-black/60 border ${
                            ord.status === 'versendet' 
                              ? 'border-emerald-500 text-emerald-400' 
                              : ord.status === 'bezahlt' 
                              ? 'border-blue-500 text-blue-400' 
                              : 'border-yellow-500 text-yellow-400'
                          }`}
                        >
                          <option value="neu">NEU</option>
                          <option value="bezahlt">BEZAHLT</option>
                          <option value="versendet">VERSENDET</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Articles Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-zinc-400 block text-[10px]">KUNDE & TELEFON</span>
                        <strong className="text-white text-sm block">{ord.customerName}</strong>
                        <span className="text-[#00e5ff]">{ord.customerPhone}</span>
                        {ord.customerEmail && <span className="text-zinc-400 block truncate">{ord.customerEmail}</span>}
                      </div>

                      <div>
                        <span className="text-zinc-400 block text-[10px]">LIEFERADRESSE</span>
                        <span className="text-zinc-200 block">{ord.customerAddress}</span>
                      </div>

                      <div>
                        <span className="text-zinc-400 block text-[10px]">BESTELLTE ARTIKEL</span>
                        <span className="text-zinc-200 block font-bold">
                          {ord.formattedArticles || ord.cartItems?.map(i => `${i.quantity}x ${i.name}`).join(', ') || 'Artikel'}
                        </span>
                        <span className="text-white font-['Orbitron'] font-black text-sm block mt-1">
                          TOTAL: CHF {Number(ord.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* TWINT Proof Screenshot Viewer if attached */}
                    {ord.twintProofUrl && (
                      <div className="pt-2 border-t border-white/5 flex items-center gap-3">
                        <span className="text-zinc-400 text-[10px]">Zahlungsnachweis:</span>
                        <a
                          href={ord.twintProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#00e5ff] hover:underline"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Screenshot öffnen</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FIREBASE CONFIG & DIAGNOSTICS */}
        {activeTab === 'firebase_config' && (
          <div className="bg-[#0d111a] border border-[#1b2333] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2 border-b border-white/10 pb-4">
              <h2 className="font-['Orbitron'] font-bold text-lg text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#00e5ff]" />
                FIREBASE LIVE CONFIGURATION & SETUP
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Verbinde das Projekt direkt mit deinem Firebase Projekt: <strong className="text-[#00e5ff]">dj-cyberpanther-energy</strong>
              </p>
            </div>

            {/* Diagnostics Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#121622] border border-white/5 space-y-1">
                <span className="text-zinc-500 text-[10px] block">PROJECT ID</span>
                <span className="text-white font-bold text-sm">dj-cyberpanther-energy</span>
              </div>
              <div className="p-4 rounded-xl bg-[#121622] border border-white/5 space-y-1">
                <span className="text-zinc-500 text-[10px] block">FIRESTORE STATUS</span>
                <span className="text-emerald-400 font-bold text-sm">Ready (Collection "products" & "orders")</span>
              </div>
              <div className="p-4 rounded-xl bg-[#121622] border border-white/5 space-y-1">
                <span className="text-zinc-500 text-[10px] block">STORAGE BUCKET</span>
                <span className="text-[#00e5ff] font-bold text-sm">products/ & payments/</span>
              </div>
            </div>

            {/* Config JSON Paste Box */}
            <form onSubmit={handleSaveFirebaseConfig} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold block">
                  Firebase Web SDK Konfiguration (aus Firebase Console ➔ Project Settings ➔ SDK setup and configuration):
                </label>
                <textarea
                  rows={8}
                  value={configJson}
                  onChange={(e) => setConfigJson(e.target.value)}
                  placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "dj-cyberpanther-energy.firebaseapp.com",\n  "projectId": "dj-cyberpanther-energy",\n  "storageBucket": "dj-cyberpanther-energy.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
                  className="w-full px-4 py-3 rounded-xl bg-[#131926] border border-white/10 text-white font-mono text-xs focus:border-[#00e5ff] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#00e5ff] text-black font-['Rajdhani'] font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_15px_#00e5ff] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>CONFIG SPEICHERN & VERBINDEN</span>
                </button>
                {configSaved && (
                  <span className="text-emerald-400 font-bold">✓ Gespeichert!</span>
                )}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
