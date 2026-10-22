# DJ CYBERPANTHER ENERGY — Offizieller Cyberpunk Winter Rave Online-Shop

> **Brand Identity:** Cyberpunk x Winter x Forest Rave  
> **Symbolik:** Schwarzer Panther mit rot leuchtenden Augen, Nordlicht, Schnee, gefrorener Schweizer Tannenwald  
> **Farbpalette:** Schwarz `#0a0a0a`, Neon Rot `#ff003c`, Ice Blue `#00e5ff`, Snow White `#f5f5f5`, Forest Green `#0a3d1f`  
> **Produkte:** DUO MIX 6-Pack Boxen (6x 500ml / 3.0L) & Einzel-Dosen 500ml  
> **Flavors:** TANNENZAUBER (Pine Cranberry), ZIMTSTERN NEBEL, PUNSCH COFFEE, NORDLICHT PUNSCH, ZIMT COLA, VANILLE SCHNEE X

---

## ⚡ Features im Überblick

1. **Hero Section:** Orshot-Style Visual Loop, pulsierender 133 BPM Forest Rave Beat-Synthesizer, Ambient Snowfall Overlay & "SHOP NOW" Button.
2. **Interaktive 3D Dual-Ansicht pro Produkt:**
   - **Bild 1:** Box **MIT** Verpackung (6-Pack Box mit Tragegriff & Cyberpanther Artwork)
   - **Bild 2:** 2 Dosen **OHNE** Verpackung im Schnee mit Kondenswassertropfen & Eiskristallen
3. **Produktkatalog mit echter Dieline-Extraktion:**
   - DUO MIX 6-Pack: TANNENZAUBER + ZIMT COLA (3.0L)
   - DUO MIX 6-Pack: NORDLICHT PUNSCH + VANILLE SCHNEE X (3.0L)
   - NORDLICHT PUNSCH 500ml
   - VANILLE SCHNEE X 500ml
   - TANNENZAUBER 500ml
   - ZIMTSTERN NEBEL 500ml
   - PUNSCH COFFEE 500ml
   - ZIMT COLA 500ml
4. **Warenkorb & Slide-out Drawer:**
   - Schweizer Franken (CHF)
   - Gratis-Versand Fortschrittsbalken (Ab CHF 50.- kostenloser A-Post Versand)
5. **Checkout & Multi-Channel Zahlung:**
   - **TWINT Zahlung:**
     - Empfänger: **076 322 79 81**
     - Dynamischer TWINT QR-Code Generator mit Betrag und Referenz `CYBERPANTHER + Name`
     - Direkter `twint://pay?amount=...` Link für Smartphones
     - Screenshot-Upload als Zahlungsbeweis direkt in Firebase Storage `payments/`
   - **WhatsApp Bestellung via Calmebot / Meta Cloud API:**
     - Zielnummer: **079 833 93 87** (`41798339387`)
     - Template: `dj_cyberpanther_order` mit 4 Variablen:
       1. `Name` (Kundenname)
       2. `Referenz` (Bestellnummer z.B. `CP-829104`)
       3. `Total` (CHF Betrag)
       4. `Artikel` (z.B. "2x TANNENZAUBER, 1x DUO MIX")
     - Automatisches Speichern der Bestellung in Firestore Collection `orders`
6. **Admin Panel (`/admin` oder Hash `#admin`):**
   - Admin-Zugang (Passcode: `cyberpanther` oder `panther2026`)
   - **Produkte anlegen & bearbeiten:**
     - Bild-Upload direkt nach Firebase Storage `products/` (Box Front, Dosen im Schnee, Dose Front, Mockup)
     - Live-Preview der Produktkarte in Echtzeit
     - 1-Klick Firestore Initialisierung (speichert alle 8 Dieline-Produkte direkt in Firestore `products`)
   - **Bestellungen verwalten:**
     - Live-Sync aus Firestore `orders` (onSnapshot)
     - Anzeige von Kunde, Adresse, Telefon, Artikeln, WhatsApp-Status
     - Screenshot-Betrachter für TWINT-Zahlungsbelege
     - Status-Wechsler (`neu`, `bezahlt`, `versendet`)
   - **Firebase Diagnostics & In-App Config Editor:**
     - Erlaubt das Einfügen des Firebase Web SDK JSONs direkt in der App.

---

## 🛠️ Setup & Firebase Verbindung

### 1. Firebase Projekt konfigurieren
Das Projekt ist auf dein Projekt **`dj-cyberpanther-energy`** vorbereitet.

1. Öffne die [Firebase Console](https://console.firebase.google.com/)
2. Wähle **`dj-cyberpanther-energy`**
3. **Firestore Database:** Klicke auf *Firestore Database* ➔ *Datenbank erstellen* (Region z.B. `europe-west6` Zürich oder `europe-west1`).
4. **Storage:** Klicke auf *Storage* ➔ *Get Started* (Ordner `products/` und `payments/` werden automatisch angelegt).
5. **Web App SDK Config:**
   - Gehe zu *Projekt-Einstellungen* (Zahnrad oben links) ➔ *Allgemein* ➔ *Deine Apps* ➔ *Web-App* (`</>`).
   - Kopiere das `firebaseConfig` Objekt.

### 2. Config hinterlegen

Entweder in der `.env` Datei:
```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="dj-cyberpanther-energy.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="dj-cyberpanther-energy"
VITE_FIREBASE_STORAGE_BUCKET="dj-cyberpanther-energy.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."

# WhatsApp & TWINT
VITE_WHATSAPP_TEMPLATE_ORDER="dj_cyberpanther_order"
VITE_ORDER_PHONE="0798339387"
VITE_TWINT_NUMBER="0763227981"
VITE_PHONE_ID="your_meta_phone_id"
VITE_WHATSAPP_TOKEN="your_meta_token"
```

**ODER direkt im Admin Panel (`/admin`):**
Öffne den Reiter **"Firebase Config & Diagnostics"** im Admin Panel und füge das JSON einfach in das Textfeld ein ➔ Auf **"Config Speichern"** klicken!

---

## 🚀 GitHub Pages Deployment

1. Setze in `vite.config.ts` falls nötig die Base-URL für dein Repository:
   ```ts
   export default defineConfig({
     base: './', // Erlaubt relativen Pfad für GitHub Pages
     ...
   });
   ```
2. Baue das Bundle:
   ```bash
   npm run build
   ```
3. Der erstellte Ordner `/dist` kann direkt per GitHub Actions oder GitHub Pages Branch (`gh-pages`) bereitgestellt werden.

---

## 🔐 Sicherheit & Firestore Rules

Die bereitgestellte Datei `firestore.rules` schützt die Datenbank:
- `products`: Öffentlich lesbar, Schreibzugriff für Admin
- `orders`: Für Bestellungen erstellbar, Lese- und Schreibzugriff für den Admin gesichert.
