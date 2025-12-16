jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  getFeedsApi: jest.fn()
}));

import {
  ordersReducer as reducer,
  fetchUserOrders,
  fetchFeed
} from './ordersSlices';
import { getOrdersApi, getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

describe('ordersSlices reducer', () => {
  const initialState = {
    userOrders: [],
    feedOrders: [],
    feed: {
      total: 0,
      totalToday: 0
    },
    loading: false,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('fetchUserOrders', () => {
    const mockOrders: TOrder[] = [
      {
        _id: 'order1',
        ingredients: ['ing1', 'ing2'],
        status: 'done',
        name: 'Test Order 1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        number: 12345
      }
    ];

    it('должен обрабатывать pending состояние', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = reducer(initialState, action as any);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };

      const state = reducer(initialState, action as any);

      expect(state.loading).toBe(false);
      expect(state.userOrders).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать rejected состояние', () => {
      const errorMessage = 'Ошибка загрузки заказов';
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: errorMessage }
      };

      const state = reducer(initialState, action as any);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  it('должен возвращать текущее состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = reducer(initialState, action);
    expect(state).toEqual(initialState);
  });
});

describe('ordersSlices thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('test-token');
  });

  describe('fetchUserOrders thunk', () => {
    it('должен вызывать getOrdersApi и возвращать заказы пользователя', async () => {
      const mockOrders = [
        {
          _id: 'order1',
          ingredients: ['ing1', 'ing2'],
          status: 'done',
          name: 'Test Order 1',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          number: 12345
        }
      ];

      (getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = fetchUserOrders();
      const result = await thunk(dispatch, getState, undefined);

      expect(getOrdersApi).toHaveBeenCalled();
      expect(result.type).toBe('orders/fetchUserOrders/fulfilled');
      expect(result.payload).toEqual(mockOrders);
    });

    it('должен возвращать rejected при ошибке загрузки заказов', async () => {
      const error = new Error('Ошибка загрузки');
      (getOrdersApi as jest.Mock).mockRejectedValue(error);

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = fetchUserOrders();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('orders/fetchUserOrders/rejected');
      expect((result as any).error?.message).toBe('Ошибка загрузки');
    });
  });

  describe('fetchFeed thunk', () => {
    it('должен вызывать getFeedsApi и возвращать ленту заказов', async () => {
      const mockFeedData = {
        orders: [
          {
            _id: 'order1',
            ingredients: ['ing1'],
            status: 'pending',
            name: 'Feed Order',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            number: 54321
          }
        ],
        total: 100,
        totalToday: 10
      };

      (getFeedsApi as jest.Mock).mockResolvedValue(mockFeedData);

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = fetchFeed();
      const result = await thunk(dispatch, getState, undefined);

      expect(getFeedsApi).toHaveBeenCalled();
      expect(result.type).toBe('orders/fetchFeed/fulfilled');
      expect(result.payload).toEqual(mockFeedData);
    });

    it('должен возвращать rejected при ошибке загрузки ленты', async () => {
      const error = new Error('Ошибка загрузки ленты');
      (getFeedsApi as jest.Mock).mockRejectedValue(error);

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = fetchFeed();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('orders/fetchFeed/rejected');
      expect((result as any).error?.message).toBe('Ошибка загрузки ленты');
    });
  });
});
