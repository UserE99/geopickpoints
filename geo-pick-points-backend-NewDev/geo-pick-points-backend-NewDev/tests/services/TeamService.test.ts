import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createTeam, deleteTeam, getPlayerInTeam, updateTeam, updateTeamPOIs } from '../../src/services/TeamService';
import { Team } from '../../src/model/TeamModel';
import { TeamResource } from '../../src/Resources';

let mongoServer: MongoMemoryServer;

/*
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
}, 50000);
*/

describe('TeamService Tests', () => {
    let teamId: string;
    let playerId1 = new mongoose.Types.ObjectId().toString();
    let playerId2 = new mongoose.Types.ObjectId().toString();

    it('should create a team with players', async () => {
        const teamResource: TeamResource = {
            name: 'Test Team',
            codeInvite: 'INV123',
            qaCode: 'QA456',
            shareUrl: 'https://example.com/team',
            poiId: [],
            poiPoints: [],
            playersID: [playerId1] // Ensuring playersID is included
        };

        const team = await createTeam(teamResource, 'Test Team');
        teamId = team.id!;

        expect(team.id).toBeDefined();
        expect(team.name).toBe('Test Team');
        expect(team.playersID).toEqual([playerId1]);
    });

    it('should get players in a team', async () => {
        const players = await getPlayerInTeam(teamId);
        expect(players).toEqual([playerId1]);
    });

    it('should update a team by adding a new player without duplicates', async () => {
        await updateTeam(teamId, { players: [playerId1, playerId2] });

        const updatedTeam = await Team.findById(teamId);
        expect(updatedTeam).toBeDefined();
        expect(updatedTeam!.players.length).toBe(2);
        expect(updatedTeam!.players.map(p => p.toString())).toEqual(expect.arrayContaining([playerId1, playerId2]));
    });

    it('should delete a team', async () => {
        await deleteTeam(teamId);
        await expect(getPlayerInTeam(teamId)).rejects.toThrow('Team nicht gefunden');
    });

    it('should update POIs in a team', async () => {
        const teamResource: TeamResource = {
            name: 'Test Team',
            codeInvite: 'INV123',
            qaCode: 'QA456',
            shareUrl: 'https://example.com/team',
            poiId: [],
            poiPoints: [],
            playersID: []
        };
    
        const team = await createTeam(teamResource, 'Test Team');
        const teamId = team.id!;
        const poi1 = new mongoose.Types.ObjectId().toString();
        const poi2 = new mongoose.Types.ObjectId().toString();
    
        await updateTeamPOIs(teamId, { poiId: [poi1, poi2] });
    
        const updatedTeam = await Team.findById(teamId);
        expect(updatedTeam!.poiId.map(p => p.toString())).toEqual([poi1, poi2]);
    });
    
});
