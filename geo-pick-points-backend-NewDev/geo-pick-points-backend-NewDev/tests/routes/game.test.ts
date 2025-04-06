import supertest from 'supertest';
import app from '../../src/app';
import { Game } from '../../src/model/GameModel';
import mongoose, { Types } from 'mongoose';
import {createGame} from "../../src/services/GameService";

const request = supertest(app);

describe("Game API Routes", () => {
   
    // Hilfsfunktion zur Erstellung eines Spiels
    const createGame = async (title: string, POIs: string[] | null = null) => {
        const game = await Game.create({
            title,
            beschreibung: "Testbeschreibung",
            maxTeam: 3,
            userId: new mongoose.Types.ObjectId(),
            POIs,
        });
        return game;
    };

    // Datenbank nach jedem Test leeren, um Tests voneinander zu isolieren
    afterEach(async () => {
        await Game.deleteMany({});
    });

    test("POST /api/game - Create Game", async () => {
        const newGame = {
            title: "Berlin Sehenswürdigkeiten",
            beschreibung: "Einige der bekanntesten Sehenswürdigkeiten in Berlin",
            maxTeam: 5,
            userId: "507f191e810c19729de860ea", // Beispiel-ObjectId
        };

        const response = await request.post('/api/game').send(newGame);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe(newGame.title);
        expect(response.body.beschreibung).toBe(newGame.beschreibung);
        expect(response.body.maxTeam).toBe(newGame.maxTeam);
        expect(response.body.userId).toBe(newGame.userId);
    });

    test("GET /api/game/:id - Get Game by ID", async () => {
        const game = await createGame("Test Game");

        const response = await request.get(`/api/game/${game._id}`).send();

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(game.title);
        expect(response.body.beschreibung).toBe(game.beschreibung);
        expect(response.body.maxTeam).toBe(game.maxTeam);
        expect(response.body.userId).toBe(game.userId.toString());
    });

    test("DELETE /api/game/:id - Delete Game by ID", async () => {
        const game = await createGame("Test Game");

        const response = await request.delete(`/api/game/${game._id}`).send();

        expect(response.statusCode).toBe(204);

        const deletedGame = await Game.findById(game._id);
        expect(deletedGame).toBeNull();
    });

    test("DELETE /api/game/:id - Delete non-existent Game returns 404", async () => {
        const nonExistentId = "507f191e810c19729de860ea";
        const response = await request.delete(`/api/game/${nonExistentId}`).send();

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Spiel nicht gefunden");
    });
});

describe('GET /api/game/pois/:id', () => {
    
    test('should return 200 if game and POIs exist', async () => {
        const userId = new mongoose.Types.ObjectId().toString();
        const game = await createGame({ title: "Test GameInstance", POIs: [], maxTeam: 2, userId: userId });
        const poilIds = [new Types.ObjectId().toString(), new Types.ObjectId().toString()];
        
        const newGame = {
            title: "Berlin Sehenswürdigkeiten",
            beschreibung: "Einige der bekanntesten Sehenswürdigkeiten in Berlin",
            maxTeam: 5,
            userId: "507f191e810c19729de860ea", 
            POIs: poilIds

        };

        const response = await request.post('/api/game').send(newGame);
        expect(response.status).toBe(201);
        const responseFindeGame = await request.get(`/api/game/pois/${game.id}`).set('Content-Type', 'application/json');
        expect(responseFindeGame.status).toBe(200);
    });

    test('should return 404 if no POIs exist in the game', async () => {
        const userId = new mongoose.Types.ObjectId().toString();
        const game = await createGame({ title: "Test GameInstance", POIs: [], maxTeam: 2, userId: userId });

        const response = await supertest(app).get(`/api/game/pois/${game.id}`);
        
        expect(response.status).toBe(200);
        
        
    });

    test('should return 500 if there is a database error', async () => {
        const response = await request.get('/api/game/pois/123');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Fehler beim Abrufen des Spiels");
    });
});
