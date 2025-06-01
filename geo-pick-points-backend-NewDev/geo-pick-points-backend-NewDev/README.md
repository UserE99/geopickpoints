# 📍 GeoPickPoints – Backend

**GeoPickPoints** ist ein Backend-System zur Verwaltung geografischer Punkte (Points of Interest). Es bietet eine sichere Nutzerregistrierung mit E-Mail-Verifizierung, Login mit JWT, sowie umfangreiche REST-APIs zur Interaktion mit POIs, Nutzern, Teams, Spielern und Spielinstanzen. Dieses Projekt wurde im Rahmen eines Studienprojekts entwickelt und basiert vollständig auf TypeScript.

---

## 🔧 Tech Stack

- **TypeScript** – Typsicheres JavaScript
- **Node.js + Express** – RESTful API-Server
- **MongoDB + Mongoose** – Dokumentenbasierte Datenbank & Datenmodellierung
- **Jest** – Testing-Framework
- **Dotenv** – Verwaltung von Umgebungsvariablen
- **HTTPS (lokal)** – SSL-Verschlüsselung über Zertifikate

---

## ⚙️ Setup & Installation

### 1. Repository klonen

bash
git clone https://github.com/DEINUSERNAME/geo-pick-points-backend.git
cd geo-pick-points-backend

### 2. Abhängigkeiten installieren

bash
npm install

## ▶️ Anwendung starten

### Entwicklungsmodus

bash
npm run dev

## 📁 Projektstruktur

plaintext
src/
├── model/               # Datenmodelle (Mongoose)
│   ├── GameInstanceModel.ts
│   ├── GameModel.ts
│   ├── POIModel.ts
│   ├── POIListsModel.ts
│   ├── PlayerModel.ts
│   ├── TeamModel.ts
│   └── UserModel.ts

├── routes/              # API-Routen
│   ├── Authentication.ts / AuthenticationRoutes.ts
│   ├── login.ts / user.ts
│   ├── POI.ts / POILists.ts
│   ├── game.ts / gameInstance.ts
│   ├── player.ts / team.ts

├── services/            # Business-Logik
│   ├── AuthenticationService.ts
│   ├── JWTService.ts
│   ├── GameService.ts / GameInstanceService.ts
│   ├── POIService.ts / POIListsService.ts
│   ├── PlayerService.ts / TeamService.ts / UserService.ts

├── utils/               # Hilfsfunktionen
│   ├── app.ts
│   ├── index.ts
│   ├── logger.ts
│   └── Resources.ts


