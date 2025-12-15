import reducer, { 
  loginUser, 
  registerUser, 
  fetchUser, 
  updateUser, 
  logoutUser 
} from './userSlice';
import { TUser } from '@utils-types';

// Мокаем localStorage и setCookie
const mockSetCookie = jest.fn();
jest.mock('../../utils/cookie', () => ({
  setCookie: (...args: any[]) => mockSetCookie(...args)
}));

describe('userSlice reducer', () => {
  const initialState = reducer(undefined, { type: '@@INIT' });

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      user: null,
      isAuthChecked: false,
      loading: false,
      error: null
    });
  });

  describe('loginUser', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: loginUser.pending.type };
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const userData: TUser = {
        email: 'test@example.com',
        name: 'Test User'
      };
      
      const action = {
        type: loginUser.fulfilled.type,
        payload: userData
      };
      
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(userData);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать rejected состояние', () => {
      const errorMessage = 'Ошибка входа';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: registerUser.pending.type };
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const userData: TUser = {
        email: 'registered@example.com',
        name: 'Registered User'
      };
      
      const action = {
        type: registerUser.fulfilled.type,
        payload: userData
      };
      
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(userData);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('fetchUser', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: fetchUser.pending.type };
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(true);
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const userData: TUser = {
        email: 'fetched@example.com',
        name: 'Fetched User'
      };
      
      const action = {
        type: fetchUser.fulfilled.type,
        payload: userData
      };
      
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(userData);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние', () => {
      const action = { type: fetchUser.rejected.type };
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });
  });

  describe('logoutUser', () => {
    it('должен очищать пользователя при fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: { email: 'test@example.com', name: 'Test User' }
      };
      
      const action = { type: logoutUser.fulfilled.type };
      const state = reducer(stateWithUser, action);
      
      expect(state.user).toBeNull();
    });
  });
});
