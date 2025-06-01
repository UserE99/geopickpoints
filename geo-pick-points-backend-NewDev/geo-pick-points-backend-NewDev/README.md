# 📍 GeoPickPoints – Backend

**GeoPickPoints** ist das Backend eines standortbasierten Multiplayer-Spiels, bei dem Spieler geografische Punkte (Points of Interest) auf einer Karte in Echtzeit entdecken und für sich beanspruchen ("claimen") müssen. 

Das Backend verwaltet dabei alle Spiel- und Nutzerdaten: Registrierung mit E-Mail-Verifizierung, Login mit JWT-Authentifizierung, sowie die REST-APIs zur Verwaltung von POIs, Spielinstanzen, Teams und Spielern. 

Die gesamte Anwendung wurde im Rahmen eines Studienprojekts entwickelt. Das Backend basiert vollständig auf TypeScript, Express.js und MongoDB.


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

```
git clone https://github.com/DEINUSERNAME/geo-pick-points-backend.git
cd geo-pick-points-backend
```
### 2. Abhängigkeiten installieren


```npm install```
## ▶️ Anwendung starten

### Entwicklungsmodus


```npm run dev```

## 📁 Projektstruktur

```
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
```

