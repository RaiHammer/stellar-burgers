import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const createMockIngredient = (overrides: Partial<TIngredient>): TIngredient => ({
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
      
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
