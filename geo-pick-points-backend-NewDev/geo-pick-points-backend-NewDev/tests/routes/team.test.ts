import request from 'supertest';
import express from 'express';
import { teamRouter } from '../../src/routes/team';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
let app: express.Express;


beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use('/api/team', teamRouter);

});

describe('Team Routes', () => {
  let teamId: string;
  let playerId: string;

  it('should create a new team', async () => {
    const teamResource = {
      nameOfTeam: 'Test Team',
      codeInvite: 'INV123',
      qaCode: 'QA456',
      shareUrl: 'https://example.com/team',
      playersID: ['player1'],
    };

    const response = await request(app)
      .post('/api/team')
      .send(teamResource);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Team');
    teamId = response.body.id;
  });

  it('should get team by ID', async () => {
    const response = await request(app)
      .get(`/api/team/team/${teamId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(teamId);
  });

  it('should update a team by adding a new player', async () => {
    playerId = new mongoose.Types.ObjectId().toString(); // Mock playerId

    const updateData = {
      playerID: playerId,
      action: 'add',
    };

    const response = await request(app)
      .put(`/api/team/${teamId}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.players).toContain(playerId);
  });

  it('should delete a team', async () => {
    const response = await request(app)
      .delete(`/api/team/${teamId}`);

    expect(response.status).toBe(204);
  });

  it('should handle get teams by codeInvite', async () => {
    const response = await request(app)
      .get(`/api/team/${'INV123'}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
