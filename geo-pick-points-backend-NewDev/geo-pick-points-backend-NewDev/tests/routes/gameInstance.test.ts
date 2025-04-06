import mongoose, { Types } from "mongoose";
import app from "../../src/app";
import { GameInstance } from "../../src/model/GameInstanceModel";
import { Game } from "../../src/model/GameModel";
import { Team } from "../../src/model/TeamModel";
import supertest from "supertest";
import * as GameInstanceService from "../../src/services/GameInstanceService";
const request = supertest(app);

test("sollte eine neue GameInstance erstellen und 201 zurückgeben", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const game = await Game.create({ title: "Test GameInstance", POIs: [], maxTeam: "2", userId: userId });
    const team1 = await Team.create({
        name: "Team A",  
        codeInvite: "inviteCode123",  
        qaCode: "qaCode456",          
        shareUrl: "http://teamA.com", 
        poiId: [], 
        poiPoints: "1233", 
        players: [], 
        gameInstances: []
    });

    const team2 = await Team.create({
        name: "Team B", 
        codeInvite: "inviteCode789",  
        qaCode: "qaCode101",          
        shareUrl: "http://teamB.com", 
        poiId: [], 
        poiPoints: "5678", 
        players: [], 
        gameInstances: []
    });

    const team1Id = (team1._id as Types.ObjectId).toString();
    const team2Id = (team2._id as Types.ObjectId).toString();

    const gameInstanceData = {
        name: "Test Game Instance",
        status: 0,
        startTime: new Date("2023-01-01T10:00:00Z"),
        endTime: new Date("2023-01-01T12:00:00Z"),
        game: game._id,
        teamsID: [team1Id, team2Id],
    };

    const response = await supertest(app).post("/api/gameinstance").send(gameInstanceData);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBe(gameInstanceData.name);
    expect(response.body.status).toBe(gameInstanceData.status);
    expect(response.body.startTime).toBe(gameInstanceData.startTime.toISOString());
    expect(response.body.endTime).toBe(gameInstanceData.endTime.toISOString());
    expect(response.body.teamsID.length).toBe(2);
    expect(response.body.teamsID[0]).toBe(team1Id.toString());
    expect(response.body.teamsID[1]).toBe(team2Id.toString());

    // Aufräumen
    await GameInstance.findByIdAndDelete(response.body.id);
});

test("sollte 400  zurückgeben wenn error auftreten  waehrend game instance erstellen", async () => {  
    jest.spyOn(GameInstanceService, "createGameInstance").mockRejectedValue(new Error("DB error"));

    const response = await supertest(app)
        .post("/api/gameInstance")
        .send({ invalid: "data" }) 
        .set("Accept", "application/json");

    expect(response.status).toBe(400);
});

test("sollte eine GameInstance anhand der ID abrufen und 200 zurückgeben", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const game = await Game.create({ title: "Test GameInstance", POIs: [], maxTeam: "2", userId: userId });
    
    const team1 = await Team.create({
        name: "Team A", 
        codeInvite: "inviteCode123",  
        qaCode: "qaCode456",          
        shareUrl: "http://teamA.com", 
        poiId: [], 
        poiPoints: "1233", 
        players: [], 
        gameInstances: []
    });

    const team2 = await Team.create({
        name: "Team B", 
        codeInvite: "inviteCode789",  
        qaCode: "qaCode101",          
        shareUrl: "http://teamB.com", 
        poiId: [], 
        poiPoints: "5678", 
        players: [], 
        gameInstances: []
    });

    const gameInstance = await GameInstance.create({
        name: "Test Game Instance",
        status: 1,
        startTime: new Date("2023-01-01T10:00:00Z"),
        endTime: new Date("2023-01-01T12:00:00Z"),
        game: game._id,
        teams: [team1._id, team2._id],
    });
    const team1Id = (team1._id as Types.ObjectId).toString();
    const team2Id = (team2._id as Types.ObjectId).toString();


    const response = await supertest(app).get(`/api/gameinstance/${gameInstance._id.toString()}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(gameInstance._id.toString());
    expect(response.body.name).toBe(gameInstance.name);
    expect(response.body.status).toBe(gameInstance.status);
    expect(response.body.startTime).toBe(gameInstance.startTime.toISOString());
    expect(response.body.endTime).toBe(gameInstance.endTime.toISOString());
    expect(response.body.gameID).toBe(game._id.toString());
    expect(response.body.teamsID.length).toBe(2);
    expect(response.body.teamsID[0]).toBe(team1Id);
    expect(response.body.teamsID[1]).toBe(team2Id);

    await GameInstance.findByIdAndDelete(gameInstance._id);
});

test("sollte 404 zurückgeben wenn keine Game Instance Id ", async () => {
    const gameInstanceId = new Types.ObjectId().toString();
        jest.spyOn(GameInstanceService, "getGameInstanceById").mockRejectedValue(new Error("DB error"));

        const response = await request
        .get(`/api/gameInstance/${gameInstanceId}`)
        .set("Accept", "application/json");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: `GameInstance mit der ID ${gameInstanceId} wurde nicht gefunden.` });
    });

test("sollte eine GameInstance erfolgreich löschen und 200 mit Bestätigung zurückgeben", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const game = await Game.create({ title: "Test GameInstance", POIs: [], maxTeam: "2", userId: userId });
    
    const team1 = await Team.create({
        name: "Team A", 
        codeInvite: "inviteCode123",  
        qaCode: "qaCode456",          
        shareUrl: "http://teamA.com", 
        poiId: [], 
        poiPoints: "1233", 
        players: [], 
        gameInstances: []
    });

    const team2 = await Team.create({
        name: "Team B", 
        codeInvite: "inviteCode789",  
        qaCode: "qaCode101",          
        shareUrl: "http://teamB.com", 
        poiId: [], 
        poiPoints: "5678", 
        players: [], 
        gameInstances: []
    });

    const gameInstance = await GameInstance.create({
        name: "Test Game Instance",
        status: 1,
        startTime: new Date("2023-01-01T10:00:00Z"),
        endTime: new Date("2023-01-01T12:00:00Z"),
        game: game._id,
        teams: [team1._id, team2._id],
    });

    const response = await supertest(app)
        .delete(`/api/gameinstance/${gameInstance._id.toString()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "GameInstance wurde erfolgreich gelöscht!" });

    const deletedGameInstance = await GameInstance.findById(gameInstance._id).exec();
    expect(deletedGameInstance).toBeNull();
});

test("sollte 404 zurückgeben, wenn die GameInstance nicht gelöscht werden kann ", async() => {
    const gameInstanceId = new Types.ObjectId().toString();
    jest.spyOn(GameInstanceService, "deleteGameInstance").mockRejectedValue(new Error("DB error"));
    const response = await request
    .delete(`/api/gameInstance/${gameInstanceId}`)
    .set("Accept", "application/json");

    expect(response.status).toBe(404);
        expect(response.body).toEqual({ 
            error: `GameInstance mit der ID ${gameInstanceId} konnte nicht gelöscht werden.` 
        });
})