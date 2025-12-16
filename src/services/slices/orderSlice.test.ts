jest.mock('@api', () => ({
  getOrderByNumberApi: jest.fn()
}));

import { orderReducer as reducer, fetchOrderByNumber } from './orderSlice';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

describe('orderSlice reducer', () => {
  const initialState = {
    orderData: null,
    loading: false,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('fetchOrderByNumber', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = reducer(initialState, action as any);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const mockOrder: TOrder = {
        _id: 'order1',
        ingredients: [],
        status: 'done',
        name: 'Test Order',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        number: 12345
      };

      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };

      const state = reducer(initialState, action as any);

      expect(state.loading).toBe(false);
      expect(state.orderData).toEqual(mockOrder);
    });

    it('должен обрабатывать rejected состояние', () => {
      const errorMessage = 'Ошибка загрузки заказа';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };

      const state = reducer(initialState, action as any);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});

describe('fetchOrderByNumber thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен вызывать getOrderByNumberApi с правильным номером', async () => {
    const mockOrder = {
      _id: 'order1',
      ingredients: [],
      status: 'done',
      name: 'Test Order',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 12345
    };

    (getOrderByNumberApi as jest.Mock).mockResolvedValue({
      orders: [mockOrder]
    });

    const orderNumber = 12345;
    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = fetchOrderByNumber(orderNumber);
    const result = await thunk(dispatch, getState, undefined);

    expect(getOrderByNumberApi).toHaveBeenCalledWith(orderNumber);
    expect(result.type).toBe('order/fetchByNumber/fulfilled');
    expect(result.payload).toEqual(mockOrder);
  });

  it('должен возвращать rejected при ошибке', async () => {
    const error = new Error('Ошибка загрузки заказа');
    (getOrderByNumberApi as jest.Mock).mockRejectedValue(error);

    const orderNumber = 12345;
    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = fetchOrderByNumber(orderNumber);
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe('order/fetchByNumber/rejected');
    expect((result as any).error?.message).toBe('Ошибка загрузки заказа');
  });
});
