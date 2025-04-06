import mongoose from "mongoose";
import { Player } from "../../src/model/PlayerModel";
import { Team, ITeam } from "../../src/model/TeamModel";
import {
    getAllPlayers,
    getPlayer,
    createPlayer,
    deletePlayer,
    updateDeletePlayerInTeam,
    updatePlayer,
    getPlayersByTeam
} from "../../src/services/PlayerService";

beforeEach(async () => {
    await Player.deleteMany({});
    await Team.deleteMany({});
});

test("getAllPlayers - Alle Spieler abrufen", async () => {
    await Player.create({ nickName: "Player1", host: false });
    await Player.create({ nickName: "Player2", host: true });
    const players = await getAllPlayers();
    expect(players.length).toBe(2);
    expect(players[0].nickName).toBe("Player1");
    expect(players[1].nickName).toBe("Player2");
});

test("getPlayer - Spieler mit ID abrufen", async () => {
    const player = await Player.create({ nickName: "Player1", host: false });
    const fetchedPlayer = await getPlayer(player._id.toString());
    expect(fetchedPlayer?.id).toBe(player._id.toString());
    expect(fetchedPlayer?.nickName).toBe("Player1");
});

test("getPlayer - Fehler bei nicht existierendem Spieler", async () => {
    await expect(getPlayer(new mongoose.Types.ObjectId().toString())).rejects.toThrow();
});

test("createPlayer - Spieler erstellen", async () => {
    const playerData = { nickName: "NewPlayer", host: true, teamId: "" };
    const createdPlayer = await createPlayer(playerData);
    expect(createdPlayer.nickName).toBe("NewPlayer");
    expect(createdPlayer.teamId).toBe("");  // Ensure teamId is an empty string
});

test("createPlayer - Spieler erstellen und Passwort entfernt", async () => {
    const playerData = { nickName: "NewPlayerWithoutPassword", host: true, teamId: "" };
    const createdPlayer = await createPlayer(playerData);
    expect(createdPlayer.nickName).toBe("NewPlayerWithoutPassword");
    expect(createdPlayer.teamId).toBe("");  // Ensure teamId is an empty string
    expect(createdPlayer.id).toBeDefined();
});

test("deletePlayer - Spieler löschen", async () => {
    const player = await Player.create({ nickName: "ToDelete", host: false });
    await deletePlayer(player._id.toString());
    const deleted = await Player.findById(player._id);
    expect(deleted).toBeNull();
});

test("deletePlayer - Fehler bei nicht existierendem Spieler", async () => {
    await expect(deletePlayer(new mongoose.Types.ObjectId().toString())).rejects.toThrow();
});

test("updateDeletePlayerInTeam - Spieler aus Team entfernen", async () => {
    const player = await Player.create({ nickName: "Player", host: false, teamId: new mongoose.Types.ObjectId() });
    await updateDeletePlayerInTeam(player._id.toString(), { teamId: "", action: "remove" });
    const updatedPlayer = await Player.findById(player._id);
    expect(updatedPlayer?.teamId).toBeUndefined();
    expect(updatedPlayer?.leftAtInTeam).toBeDefined();  // Ensure leftAtInTeam is set
});

test("updateDeletePlayerInTeam - Spieler zu Team hinzufügen", async () => {
    const player = await Player.create({ nickName: "Player", host: false });
    const newTeamId = new mongoose.Types.ObjectId();
    await updateDeletePlayerInTeam(player._id.toString(), { teamId: newTeamId.toString(), action: "add" });
    const updatedPlayer = await Player.findById(player._id);
    expect(updatedPlayer?.teamId?.toString()).toBe(newTeamId.toString());
    expect(updatedPlayer?.joinedAtInTeam).toBeDefined();  // Ensure joinedAtInTeam is set
});

test("updateDeletePlayerInTeam - Fehler bei ungültiger Aktion", async () => {
    const player = await Player.create({ nickName: "Player", host: false });
    await expect(updateDeletePlayerInTeam(player._id.toString(), { teamId: "", action: "invalid" })).rejects.toThrow();
});

test('updateDeletePlayerInTeam - Spieler zu Team hinzufügen', async () => {
    const player = await Player.create({ nickName: 'Player', host: false });
    const newTeamId = new mongoose.Types.ObjectId().toString(); // Konvertiere ObjectId zu string
    await updateDeletePlayerInTeam(player._id.toString(), { teamId: newTeamId, action: 'add' }); 
    const updatedPlayer = await Player.findById(player._id);
    expect(updatedPlayer?.teamId).toBe(newTeamId); // Stelle sicher, dass teamId korrekt zugewiesen wurde
    expect(updatedPlayer?.joinedAtInTeam).toBeDefined();  // Überprüfe, ob joinedAtInTeam gesetzt wurde
});

test("updatePlayer - Spieler aktualisieren", async () => {
    const player = await Player.create({ nickName: "Player1", host: false });
    const updatedData = { nickName: "UpdatedPlayer" };
    const updatedPlayer = await updatePlayer(player._id.toString(), updatedData);
    expect(updatedPlayer?.nickName).toBe("UpdatedPlayer");
});

test("updatePlayer - Spieler mit ungültiger ID aktualisieren", async () => {
    const updatedData = { nickName: "UpdatedPlayer" };
    await expect(updatePlayer(new mongoose.Types.ObjectId().toString(), updatedData)).rejects.toThrow();
});

