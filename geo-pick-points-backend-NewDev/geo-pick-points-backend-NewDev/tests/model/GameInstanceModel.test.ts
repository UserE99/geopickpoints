import { GameInstance } from "../../src/model/GameInstanceModel";
import { Game } from "../../src/model/GameModel";
import { Team } from "../../src/model/TeamModel";
import mongoose, { Types } from "mongoose";

test("GameInstance Model soll erfolgreich erstellt werden", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const game = await Game.create({ title: "Test Game", POIs: [], maxTeam: "3", userId: userId });

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

    const gameInstanceData = {
        name: "Test Game Instance",
        status: 1, // läuft
        startTime: new Date("2023-01-01T10:00:00Z"),
        endTime: new Date("2023-01-01T12:00:00Z"),
        game: game._id,  // Use _id for consistency
        teams: [team1._id, team2._id], // Pass ObjectIds directly
    };

    const gameInstance = new GameInstance(gameInstanceData);
    const savedGameInstance = await gameInstance.save();
  
    expect(savedGameInstance._id).toBeDefined();
    expect(savedGameInstance.name).toBe(gameInstanceData.name);
    expect(savedGameInstance.status).toBe(gameInstanceData.status);
    expect(savedGameInstance.startTime).toEqual(gameInstanceData.startTime);
    expect(savedGameInstance.endTime).toEqual(gameInstanceData.endTime);
    expect(savedGameInstance.game.toString()).toBe(gameInstanceData.game.toString());
    expect(savedGameInstance.teams.length).toBe(2);
    expect(savedGameInstance.teams[0]).toBe(gameInstanceData.teams[0]);
   expect(savedGameInstance.teams[1]).toBe(gameInstanceData.teams[1]);
});
