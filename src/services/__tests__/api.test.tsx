import axios from 'axios';
import { api } from '../api';

// 1. Mock Axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls login endpoint and returns data on success', async () => {
    // Setup fake success response
    const mockUser = { email: 'test@test.com', token: '123' };
    mockedAxios.post.mockResolvedValueOnce({ data: mockUser });

    // Run the function
    const result = await api.login('test@test.com', 'password');

    // Check results
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/login'), 
      { email: 'test@test.com', password: 'password' }
    );
    expect(result).toEqual(mockUser);
  });

  it('throws correct error message on failure', async () => {
    // Setup fake failure
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } }
    });

    // We expect the promise to reject
    await expect(api.login('wrong', 'wrong')).rejects.toEqual('Invalid credentials');
  });
});