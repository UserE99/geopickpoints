import request from 'supertest';
import express from 'express';
import { poiRouter } from '../../src/routes/POI';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Team } from '../../src/model/TeamModel'; // Import the Team model
import { Player } from '../../src/model/PlayerModel'; // Import the Player model

let mongoServer: MongoMemoryServer;
let app: express.Express;
let teamId: string;
let playerId: string;
let poiId: string;

beforeAll(async () => {
  // Set up the in-memory MongoDB server for testing
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Initialize the express app and use the poiRouter
  app = express();
  app.use(express.json()); // Middleware for parsing JSON requests
  app.use('/api/poi', poiRouter);

  // Connect to the in-memory database
  await mongoose.connect(uri);

  // Create a Team and a Player for the tests
  const team = await Team.create({ name: 'Test Team', players: [], poiId: [], poiPoints: [] });
  teamId = team.id!; // Save the team ID

  const player = await Player.create({ nickName: 'Test Player' });
  playerId = player.id!; // Save the player ID

  // Create a POI for testing
  const poiData = {
    name: 'Test POI',
    lat: 52.5200,
    long: 13.4050,
  };
  const response = await request(app)
    .post('/api/poi')
    .send(poiData);

  poiId = response.body.id; // Save the POI ID
});

afterAll(async () => {
  // Close the database connection and stop the in-memory server
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POI Routes', () => {
  it('should create a new POI', async () => {
    const poiData = {
      name: 'Test POI',
      lat: 52.5200,
      long: 13.4050,
    };

    const response = await request(app)
      .post('/api/poi')
      .send(poiData);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test POI');
    poiId = response.body.id; // Save the POI ID
  });

  it('should claim a POI', async () => {
    const positionPlayer = { lat: 52.5205, lng: 13.4055 }; // Mock position of the player
    const claimData = {
      teamIds: [teamId],
      playerId,
      positionPlayer,
    };

    const response = await request(app)
      .post(`/api/poi/claim/${poiId}`)
      .send(claimData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('POI claimed successfully');
  });

  it('should fail to claim POI if too far away', async () => {
    const positionPlayer = { lat: 53.5205, lng: 14.4055 }; // Player is too far from the POI
    const claimData = {
      teamIds: [teamId],
      playerId,
      positionPlayer,
    };

    const response = await request(app)
      .post(`/api/poi/claim/${poiId}`)
      .send(claimData);

    expect(response.status).toBe(300);
    expect(response.body.message).toContain('Too far away');
  });

  it('should fail to claim POI if already claimed', async () => {
    const positionPlayer = { lat: 52.5205, lng: 13.4055 }; // Same position as previous successful claim
    const claimData = {
      teamIds: [teamId],
      playerId,
      positionPlayer,
    };

    const response = await request(app)
      .post(`/api/poi/claim/${poiId}`)
      .send(claimData);

    expect(response.status).toBe(300);
    expect(response.body.message).toBe('POI already claimed');
  });
});
