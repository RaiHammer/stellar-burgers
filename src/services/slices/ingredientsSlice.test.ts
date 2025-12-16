jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

const createMockIngredient = (
  overrides: Partial<TIngredient>
): TIngredient => ({
  _id: '1',
  name: 'Тестовый ингредиент',
  type: 'bun',
  proteins: 100,
  fat: 20,
  carbohydrates: 30,
  calories: 400,
  price: 1000,
  image: 'test-image.png',
  image_mobile: 'test-image-mobile.png',
  image_large: 'test-image-large.png',
  ...overrides
});

describe('ingredientsSlice reducer', () => {
  const initialState = reducer(undefined, { type: '@@INIT' });

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    it('должен обрабатывать pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled', () => {
      const mockIngredients = [
        createMockIngredient({ _id: '1', name: 'Булка', type: 'bun' }),
        createMockIngredient({ _id: '2', name: 'Начинка', type: 'main' })
      ];

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('должен обрабатывать rejected', () => {
      const errorMessage = 'Ошибка загрузки';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };

      const state = reducer(initialState, action as any);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});

describe('fetchIngredients thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен вызывать getIngredientsApi и возвращать ингредиенты', async () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'Краторная булка N-200i',
        type: 'bun' as const,
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      }
    ];

    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = fetchIngredients();
    const result = await thunk(dispatch, getState, undefined);

    expect(getIngredientsApi).toHaveBeenCalled();
    expect(result.type).toBe('ingredients/fetchAll/fulfilled');
    expect(result.payload).toEqual(mockIngredients);
  });

  it('должен возвращать rejected при ошибке загрузки ингредиентов', async () => {
    const error = new Error('Ошибка сети');
    (getIngredientsApi as jest.Mock).mockRejectedValue(error);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = fetchIngredients();
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe('ingredients/fetchAll/rejected');
    expect((result as any).error?.message).toBe('Ошибка сети');
  });
});
