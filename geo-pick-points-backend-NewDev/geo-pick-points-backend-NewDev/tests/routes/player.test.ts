import request from 'supertest';
import express from 'express';
import { playerRouter } from '../../src/routes/player';
import { Player } from '../../src/model/PlayerModel';
import mongoose from 'mongoose';

// Set up Express app and use the router
const app = express();
app.use(express.json());
app.use('/players', playerRouter);

beforeEach(async () => {
    await Player.deleteMany({});
});

test("POST /players - Spieler erstellen", async () => {
    const playerData = { nickName: "NewPlayer", host: true, teamId: "" };
    
    const response = await request(app)
        .post('/players')
        .send(playerData);
    
    expect(response.status).toBe(201);
    expect(response.body.nickName).toBe("NewPlayer");
    expect(response.body.teamId).toBe(""); // Ensure teamId is an empty string
});

test("POST /players - Fehler bei fehlenden Daten", async () => {
    const response = await request(app)
        .post('/players')
        .send({});
    
    expect(response.status).toBe(404);
});

test("GET /players/:id - Spieler abrufen", async () => {
    const player = await Player.create({ nickName: "Player1", host: false });
    const response = await request(app)
        .get(`/players/${player._id}`);
    
    expect(response.status).toBe(200);
    expect(response.body.nickName).toBe("Player1");
});

test("GET /players/:id - Fehler bei nicht existierendem Spieler", async () => {
    const response = await request(app)
        .get(`/players/${new mongoose.Types.ObjectId()}`);
    
    expect(response.status).toBe(404);
});

test("DELETE /players/:id - Spieler löschen", async () => {
    const player = await Player.create({ nickName: "ToDelete", host: false });
    
    const response = await request(app)
        .delete(`/players/${player._id}`);
    
    expect(response.status).toBe(204); // No content
    const deletedPlayer = await Player.findById(player._id);
    expect(deletedPlayer).toBeNull();
});

test("DELETE /players/:id - Fehler bei nicht existierendem Spieler", async () => {
    const response = await request(app)
        .delete(`/players/${new mongoose.Types.ObjectId()}`);
    
    expect(response.status).toBe(404);
});

test("PUT /players/:id - Spieler aus Team entfernen", async () => {
    const player = await Player.create({ nickName: "Player", host: false, teamId: new mongoose.Types.ObjectId() });
    
    const response = await request(app)
        .put(`/players/${player._id}`)
        .send({ teamId: "", action: "remove" });
    
    expect(response.status).toBe(200);
    expect(response.body.teamId).toBeUndefined();
    expect(response.body.leftAtInTeam).toBeDefined();  // Ensure leftAtInTeam is set
});

test("PUT /players/:id - Spieler zu Team hinzufügen", async () => {
    const player = await Player.create({ nickName: "Player", host: false });
    const newTeamId = new mongoose.Types.ObjectId().toString();
    
    const response = await request(app)
        .put(`/players/${player._id}`)
        .send({ teamId: newTeamId, action: "add" });
    
    expect(response.status).toBe(200);
    expect(response.body.teamId).toBe(newTeamId); // Ensure teamId is updated
    expect(response.body.joinedAtInTeam).toBeDefined();  // Ensure joinedAtInTeam is set
});

test("PUT /players/:id - Fehler bei ungültiger Aktion", async () => {
    const player = await Player.create({ nickName: "Player", host: false });
    
    const response = await request(app)
        .put(`/players/${player._id}`)
        .send({ teamId: "", action: "invalid" });
    
    expect(response.status).toBe(404);  // Invalid action should result in error
});

test("GET /players/team/:teamId - Spieler nach Team-ID abrufen", async () => {
    const teamId = new mongoose.Types.ObjectId();
    const player = await Player.create({ nickName: "PlayerInTeam", host: false, teamId });
    
    const response = await request(app)
        .get(`/players/team/${teamId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].nickName).toBe("PlayerInTeam");
});

test("GET /players/team/:teamId - Keine Spieler in Team", async () => {
    const teamId = new mongoose.Types.ObjectId();
    
    const response = await request(app)
        .get(`/players/team/${teamId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);  // No players should be returned
});
