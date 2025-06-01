# 🗺️ GeoPickPoints – Frontend

**GeoPickPoints** ist ein browserbasiertes Multiplayer-Spiel, bei dem Spieler geografische Punkte (Points of Interest) in Echtzeit auf einer Karte entdecken und gegeneinander "claimen" müssen. 

Dieses Frontend stellt die Benutzeroberfläche für das Spiel dar, inklusive Lobby-System, Login/Signup, Spielansicht, Echtzeit-Spielstatus und Karteninteraktion. Die Kommunikation mit dem Backend erfolgt über REST-APIs und WebSockets.

---

## ⚙️ Tech Stack

- **React + TypeScript** – Komponentenbasierter UI-Aufbau  
- **React Context API** – Game-Status-Verwaltung  
- **WebSockets** – Echtzeitkommunikation während des Spiels  
- **CSS (modular)** – Styling (App.css / index.css)  
- **Jest** – Testing  

---

## 🧩 Hauptfeatures

- 🔐 Registrierung & Login mit E-Mail-Verifizierung  
- 🌍 Kartendarstellung mit interaktiven POIs  
- 🎮 Lobbysystem: Spieler erstellen oder treten einem Spiel bei  
- ⚡ WebSocket-Verbindung für Spielstatus und Live-Aktionen  
- ✅ Dynamische Seiten wie `GameOverPage`, `MapPage`, `Lobby`, `Signup`, `Login`  
- 📤 REST-API-Kommunikation mit dem GeoPickPoints-Backend  

---

## 🚀 Setup & Installation

### 1. Repository klonen

```
git clone https://github.com/DEINUSERNAME/geo-pick-points-frontend.git
cd geo-pick-points-frontend
```

### 2. Abhängigkeiten installieren

```
npm install
```

### 3. Starten

```
npm run dev
```

### 4. Projektstruktur
```
src/
├── Pages/              # Alle Hauptseiten des Spiels
│   ├── GamePage.tsx
│   ├── MapPage.tsx
│   ├── LobbyGamePage.tsx / LobbyHostGamePage.tsx
│   ├── Login.tsx / Signup.tsx
│   ├── GameOverPage.tsx
│   ├── VerifyEmailPage.tsx / VerifyThankYouPage.tsx

├── actions/            # Spielinteraktionen (z. B. moves, claims)
├── components/         # Wiederverwendbare UI-Komponenten
├── layout/             # Oberflächenstruktur/Layout
├── store/              # Zustandsverwaltung (evtl. Redux/Context)
├── utils/              # Hilfsfunktionen und Wrapper
│   ├── WebSocketSetup.tsx
│   ├── GameStatusContext.tsx
│   ├── TopMenu.tsx etc.

├── App.tsx / index.tsx # Einstiegspunkte
├── App.css / index.css # Globale Styles
```
