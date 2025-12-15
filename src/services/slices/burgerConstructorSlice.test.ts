import reducer, { 
  addToConstructor, 
  removeFromConstructor, 
  moveIngredientUp, 
  moveIngredientDown,
  setOrderModalData 
} from './burgerConstructorSlice';
import { TIngredient, TOrder } from '@utils-types';

// Мокаем uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));

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

describe('burgerConstructorSlice reducer', () => {
  const initialState = reducer(undefined, { type: '@@INIT' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('addToConstructor', () => {
    it('должен добавлять булку', () => {
      const bun = createMockIngredient({ _id: 'bun1', type: 'bun' });
      const action = addToConstructor(bun);
      const state = reducer(initialState, action);
      
      expect(state.bun).toEqual({ ...bun, id: 'test-uuid-123' });
      expect(state.ingredients).toEqual([]);
    });

    it('должен добавлять начинку', () => {
      const ingredient = createMockIngredient({ _id: 'main1', type: 'main' });
      const action = addToConstructor(ingredient);
      const state = reducer(initialState, action);
      
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({ ...ingredient, id: 'test-uuid-123' });
    });
  });

  describe('removeFromConstructor', () => {
    it('должен удалять начинку по id', () => {
      const ingredient = createMockIngredient({ _id: 'main1', type: 'main' });
      const addAction = addToConstructor(ingredient);
      let state = reducer(initialState, addAction);
      
      const removeAction = removeFromConstructor('test-uuid-123');
      state = reducer(state, removeAction);
      
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredientUp', () => {
    it('должен перемещать ингредиент вверх', () => {
      const ingredient1 = { ...createMockIngredient({ _id: 'main1', type: 'main' }), id: 'id1' };
      const ingredient2 = { ...createMockIngredient({ _id: 'main2', type: 'main' }), id: 'id2' };
      
      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2]
      };
      
      const action = moveIngredientUp('id2');
      const state = reducer(stateWithIngredients, action);
      
      expect(state.ingredients[0].id).toBe('id2');
      expect(state.ingredients[1].id).toBe('id1');
    });
  });

  describe('setOrderModalData', () => {
    it('должен устанавливать данные заказа', () => {
      const orderData: TOrder = {
        _id: 'order1',
        status: 'done',
        name: 'Test Order',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        number: 12345,
        ingredients: []
      };
      
      const action = setOrderModalData(orderData);
      const state = reducer(initialState, action);
      
      expect(state.orderModalData).toEqual(orderData);
    });
  });
});
