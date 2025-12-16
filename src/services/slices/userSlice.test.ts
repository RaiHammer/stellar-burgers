jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

const mockSetCookie = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock('../../utils/cookie', () => ({
  setCookie: (...args: any[]) => mockSetCookie(...args)
}));

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: mockSetItem,
    removeItem: mockRemoveItem,
    getItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true
});

import reducer, {
  loginUser,
  registerUser,
  fetchUser,
  updateUser,
  logoutUser
} from './userSlice';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';

describe('userSlice reducer', () => {
  const initialState = reducer(undefined, { type: '@@INIT' });

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetItem.mockClear();
    mockRemoveItem.mockClear();
    mockSetCookie.mockClear();
  });

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      user: null,
      isAuthChecked: false,
      loading: false,
      error: null
    });
  });
});

describe('userSlice thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetItem.mockClear();
    mockRemoveItem.mockClear();
    mockSetCookie.mockClear();
  });

  describe('loginUser thunk', () => {
    it('должен вызывать loginUserApi с правильными данными', async () => {
      const mockUser = { email: 'test@example.com', name: 'Test User' };
      const mockResponse = {
        success: true,
        user: mockUser,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token'
      };

      (loginUserApi as jest.Mock).mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };
      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = loginUser(credentials);
      const result = await thunk(dispatch, getState, undefined);

      expect(loginUserApi).toHaveBeenCalledWith(credentials);
      expect(mockSetItem).toHaveBeenCalledWith(
        'refreshToken',
        'test-refresh-token'
      );
      expect(mockSetCookie).toHaveBeenCalledWith(
        'accessToken',
        'test-access-token'
      );
      expect(result.type).toBe('user/login/fulfilled');
      expect(result.payload).toEqual(mockUser);
    });
  });

  describe('registerUser thunk', () => {
    it('должен вызывать registerUserApi с правильными данными', async () => {
      const mockUser = { email: 'new@example.com', name: 'New User' };
      const mockResponse = {
        success: true,
        user: mockUser,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      };

      (registerUserApi as jest.Mock).mockResolvedValue(mockResponse);

      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User'
      };
      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = registerUser(userData);
      const result = await thunk(dispatch, getState, undefined);

      expect(registerUserApi).toHaveBeenCalledWith(userData);
      expect(mockSetItem).toHaveBeenCalledWith(
        'refreshToken',
        'new-refresh-token'
      );
      expect(mockSetCookie).toHaveBeenCalledWith(
        'accessToken',
        'new-access-token'
      );
      expect(result.type).toBe('user/register/fulfilled');
      expect(result.payload).toEqual(mockUser);
    });
  });

  describe('fetchUser thunk', () => {
    it('должен вызывать getUserApi и возвращать данные пользователя', async () => {
      const mockUser = { email: 'existing@example.com', name: 'Existing User' };
      const mockResponse = {
        success: true,
        user: mockUser
      };

      (getUserApi as jest.Mock).mockResolvedValue(mockResponse);

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = fetchUser();
      const result = await thunk(dispatch, getState, undefined);

      expect(getUserApi).toHaveBeenCalled();
      expect(result.type).toBe('user/fetchUser/fulfilled');
      expect(result.payload).toEqual(mockUser);
    });
  });

  describe('updateUser thunk', () => {
    it('должен вызывать updateUserApi с обновленными данными', async () => {
      const mockUser = { email: 'updated@example.com', name: 'Updated User' };
      const mockResponse = {
        success: true,
        user: mockUser
      };

      (updateUserApi as jest.Mock).mockResolvedValue(mockResponse);

      const userData = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword'
      };
      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = updateUser(userData);
      const result = await thunk(dispatch, getState, undefined);

      expect(updateUserApi).toHaveBeenCalledWith(userData);
      expect(result.type).toBe('user/updateUser/fulfilled');
      expect(result.payload).toEqual(mockUser);
    });
  });

  describe('logoutUser thunk', () => {
    it('должен вызывать logoutApi и очищать токены', async () => {
      (logoutApi as jest.Mock).mockResolvedValue({ success: true });

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = logoutUser();
      const result = await thunk(dispatch, getState, undefined);

      expect(logoutApi).toHaveBeenCalled();
      expect(mockRemoveItem).toHaveBeenCalledWith('refreshToken');
      expect(mockSetCookie).toHaveBeenCalledWith('accessToken', '', {
        expires: -1
      });
      expect(result.type).toBe('user/logout/fulfilled');
    });
  });
});
