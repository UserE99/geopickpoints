import mongoose, { Schema, Types } from "mongoose";
import { GameInstance } from "../../src/model/GameInstanceModel";
import { createGameInstance ,updateGameInstanceStatus, getGameInstanceById} from "../../src/services/GameInstanceService";

jest.mock('../../src/model/GameInstanceModel'); 
jest.mock('mongoose', () => ({
    ...jest.requireActual('mongoose'), 
    Types: {
      ObjectId: jest.fn().mockImplementation((id: string) => {
        // Gib ein Mock-Objekt zurück, das die gleiche Struktur wie ein ObjectId hat, aber ohne den Konstruktor zu verwenden
        return { toString: () => id };
      }),
    },
  }));


describe('createGameInstance', () => {
    it('should create and return a new game instance', async () => {
      const gameInstanceData = {
        name: 'Test Game',
        status: 0,
        startTime: '2025-02-02T10:00:00Z',
        endTime: '2025-02-02T12:00:00Z',
        gameID: 'gameId123',
        teamsID: ['team1', 'team2']
      };
  
      const mockedSave = jest.fn().mockResolvedValue({
        _id: 'newGameInstanceId',
        name: 'Test Game',
        status: '0',
        startTime: new Date('2025-02-02T10:00:00Z'),
        endTime: new Date('2025-02-02T12:00:00Z'),
        game: new mongoose.Types.ObjectId('gameId123'),
      teams: [new mongoose.Types.ObjectId('team1'), new mongoose.Types.ObjectId('team2')],
    });
  
      // Setze das Mongoose-Modell `GameInstance` so, dass es die gemockte `save` Methode verwendet
      const GameInstanceMock = GameInstance as unknown as jest.Mock;
    GameInstanceMock.mockImplementation(() => ({
      save: mockedSave
    }));
  
      const result = await createGameInstance(gameInstanceData);
  
      expect(result).toEqual({
        id: 'newGameInstanceId',
        name: 'Test Game',
        status: '0',
        startTime: '2025-02-02T10:00:00.000Z',
        endTime: '2025-02-02T12:00:00.000Z',
        gameID: 'gameId123',
        teamsID: ['team1', 'team2']
      });

      expect(mockedSave).toHaveBeenCalled();

    });
  });

  describe('updateGameInstanceStatus', () => {
    it('should successfully update the status of a game instance and return the updated data', async () => {
        
        const mockFindByIdAndUpdate = jest.fn().mockResolvedValue({
            _id: '12345',
            name: 'Test Game',
            status: 1,
            startTime: new Date('2025-02-02T10:00:00Z'),
            endTime: new Date('2025-02-02T12:00:00Z'),
            game: 'gameId123',
            teams: ['team1', 'team2'],
        });
        
        mockFindByIdAndUpdate.mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                _id: '12345',
                name: 'Test Game',
                status: 1,
                startTime: new Date('2025-02-02T10:00:00Z'),
                endTime: new Date('2025-02-02T12:00:00Z'),
                game: 'gameId123',
                teams: ['team1', 'team2'],
            }),
        });

        
        GameInstance.findByIdAndUpdate = mockFindByIdAndUpdate;

      
        const id = '12345';
        const status = 1;

        const result = await updateGameInstanceStatus(id, status);

        
        expect(result).toEqual({
            id: '12345',
            name: 'Test Game',
            status: 1,
            startTime: '2025-02-02T10:00:00.000Z',
            endTime: '2025-02-02T12:00:00.000Z',
            gameID: 'gameId123',
            teamsID: ['team1', 'team2']
        });

        
        expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
            id,
            { status },
            { new: true }
        );
    });

    it('should throw an error if the game instance is not found', async () => {
       const mockFindByIdAndUpdate = jest.fn().mockResolvedValue(null);
        // Ensure the exec() function is available and mock it
        mockFindByIdAndUpdate.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null), 
        });
        // Assigning the mock to the GameInstance model
        GameInstance.findByIdAndUpdate = mockFindByIdAndUpdate;

        
        const id = 'nonExistingId';
        const status = 1;

       
        await expect(updateGameInstanceStatus(id, status))
            .rejects
            .toThrowError(`GameInstance mit der ID ${id} konnte nicht aktualisiert werden.`);

        
        expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
            id,
            { status },
            { new: true }
        );
    });
});


describe('getGameInstanceById', () => {
    it('should successfully return the game instance data if it exists', async () => {
        // Mocking the return value of findById (simulating that the game instance was found)
        const mockFindById = jest.fn().mockResolvedValue({
            _id: '12345',
            name: 'Test Game',
            status: 1,
            startTime: new Date('2025-02-02T10:00:00Z'),
            endTime: new Date('2025-02-02T12:00:00Z'),
            game: 'gameId123',
            teams: ['team1', 'team2'],
        });
        
        mockFindById.mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                _id: '12345',
                name: 'Test Game',
                status: 1,
                startTime: new Date('2025-02-02T10:00:00Z'),
                endTime: new Date('2025-02-02T12:00:00Z'),
                game: 'gameId123',
                teams: ['team1', 'team2'],
            }),
        });

        // Assigning the mock to the GameInstance model
        GameInstance.findById = mockFindById;

       
        const id = '12345';

        const result = await getGameInstanceById(id);

        // Verifying the returned data matches the mock data
        expect(result).toEqual({
            id: '12345',
            name: 'Test Game',
            status: 1,
            startTime: '2025-02-02T10:00:00.000Z',
            endTime: '2025-02-02T12:00:00.000Z',
            gameID: 'gameId123',
            teamsID: ['team1', 'team2'],
        });

        expect(mockFindById).toHaveBeenCalledWith(id);
    });

    it('should throw an error if the game instance is not found', async () => {
        // Mocking the return value of findById to simulate no game instance found
        const mockFindById = jest.fn().mockResolvedValue(null);

        mockFindById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null), 
        });
        
        GameInstance.findById = mockFindById;

        
        const id = 'nonExistingId';

        // Calling the service function and expecting it to throw an error
        await expect(getGameInstanceById(id))
            .rejects
            .toThrowError(`GameInstance mit der ID ${id} wurde nicht gefunden.`);

        
        expect(mockFindById).toHaveBeenCalledWith(id);
    });
});
