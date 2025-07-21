import axios from 'axios';
import { TronClient } from '../../src/api/tronClient';
import { config } from '../../src/config';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TronClient', () => {
  let tronClient: TronClient;

  beforeEach(() => {
    tronClient = new TronClient();
    jest.clearAllMocks();
  });

  describe('getLatestBlock', () => {
    it('should return formatted block data on successful request', async () => {
      // Arrange
      const mockBlockData = {
        blockID: '0000000000000001',
        block_header: {
          raw_data: {
            number: 1,
            timestamp: 1620000000000,
            witness_address: 'TST...'
          }
        },
        transactions: []
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: mockBlockData
      });

      // Act
      const result = await tronClient.getLatestBlock();

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${config.tronNodeUrl}/wallet/getnowblock`,
        {},
        expect.objectContaining({
          timeout: config.requestTimeout,
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual(mockBlockData);
    });

    it('should retry and throw error when request fails', async () => {
      // Arrange
      const errorMessage = 'Network Error';
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(tronClient.getLatestBlock()).rejects.toThrow(errorMessage);
      expect(mockedAxios.post).toHaveBeenCalledTimes(config.maxRetries);
    });
  });
});