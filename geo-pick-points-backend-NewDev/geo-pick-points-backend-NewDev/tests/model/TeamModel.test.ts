import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Team } from '../../src/model/TeamModel';

let mongoServer: MongoMemoryServer;

/*
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});
*/


describe('Team Model Test Suite', () => {
    it('should create and save a team successfully', async () => {
        const teamData = {
            name: 'Test Team',
            codeInvite: 'INV123',
            qaCode: 'QA456',
            shareUrl: 'https://example.com/team',
            poiId: [],
            poiPoints: [],
            players: []
        };
        
        const team = new Team(teamData);
        const savedTeam = await team.save();

        expect(savedTeam._id).toBeDefined();
        expect(savedTeam.name).toBe(teamData.name);
        expect(savedTeam.codeInvite).toBe(teamData.codeInvite);
        expect(savedTeam.qaCode).toBe(teamData.qaCode);
        expect(savedTeam.shareUrl).toBe(teamData.shareUrl);
        expect(savedTeam.poiId).toEqual([]);
        expect(savedTeam.poiPoints).toEqual([]);
        expect(savedTeam.players).toEqual([]); // Should be removed later
    });

    it('should fail when a required field is missing', async () => {
        const team = new Team({
            codeInvite: 'INV123',
            qaCode: 'QA456',
            shareUrl: 'https://example.com/team'
        });

        await expect(team.save()).rejects.toThrow();
    });

    it('should store and retrieve poiId and poiPoints correctly', async () => {
        const team = new Team({
            name: 'Point Team',
            codeInvite: 'INV789',
            qaCode: 'QA999',
            shareUrl: 'https://example.com/team2',
            poiId: [new mongoose.Types.ObjectId()],
            poiPoints: [50],
            players: []
        });

        await team.save();
        const foundTeam = await Team.findOne({ name: 'Point Team' });

        expect(foundTeam).toBeDefined();
        expect(foundTeam!.poiId.length).toBe(1);
        expect(foundTeam!.poiPoints.length).toBe(1);
        expect(foundTeam!.poiPoints[0]).toBe(50);
    });

    it('should delete a team', async () => {
        const team = new Team({
            name: 'Delete Me',
            codeInvite: 'INV999',
            qaCode: 'QA888',
            shareUrl: 'https://example.com/team3',
            poiId: [],
            poiPoints: [],
            players: []
        });

        await team.save();
        const deletedTeam = await Team.deleteOne({ name: 'Delete Me' });

        expect(deletedTeam.deletedCount).toBe(1);
    });
});
