jest.mock('@api', () => ({
  orderBurgerApi: jest.fn()
}));
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));

import { orderBurgerApi } from '@api';

import reducer, {
  addToConstructor,
  removeFromConstructor,
  moveIngredientUp,
  moveIngredientDown,
  setOrderModalData,
  createOrder
} from './burgerConstructorSlice';
import { TIngredient, TOrder } from '@utils-types';

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

describe('burgerConstructorSlice reducer', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };

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
      expect(state.ingredients[0]).toEqual({
        ...ingredient,
        id: 'test-uuid-123'
      });
    });

    it('должен заменять булку при добавлении новой', () => {
      const bun1 = createMockIngredient({ _id: 'bun1', type: 'bun' });
      const bun2 = createMockIngredient({ _id: 'bun2', type: 'bun' });

      let state = reducer(initialState, addToConstructor(bun1));
      expect(state.bun?._id).toBe('bun1');

      state = reducer(state, addToConstructor(bun2));
      expect(state.bun?._id).toBe('bun2');
    });
  });

  describe('removeFromConstructor', () => {
    it('должен удалять начинку по id', () => {
      const ingredient = createMockIngredient({ _id: 'main1', type: 'main' });
      const addAction = addToConstructor(ingredient);
      let state = reducer(initialState, addAction);

      expect(state.ingredients).toHaveLength(1);

      const removeAction = removeFromConstructor('test-uuid-123');
      state = reducer(state, removeAction);

      expect(state.ingredients).toHaveLength(0);
    });

    it('не должен удалять булку через removeFromConstructor', () => {
      const bun = createMockIngredient({ _id: 'bun1', type: 'bun' });
      let state = reducer(initialState, addToConstructor(bun));

      expect(state.bun).toBeDefined();

      state = reducer(state, removeFromConstructor('test-uuid-123'));
      expect(state.bun).toBeDefined();
    });
  });

  describe('Изменение порядка ингредиентов', () => {
    const createStateWithIngredients = () => {
      const ingredient1 = {
        ...createMockIngredient({ _id: 'main1', type: 'main' }),
        id: 'id1'
      };
      const ingredient2 = {
        ...createMockIngredient({ _id: 'main2', type: 'main' }),
        id: 'id2'
      };
      const ingredient3 = {
        ...createMockIngredient({ _id: 'main3', type: 'main' }),
        id: 'id3'
      };

      return {
        ...initialState,
        ingredients: [ingredient1, ingredient2, ingredient3]
      };
    };

    describe('moveIngredientUp', () => {
      it('должен перемещать ингредиент вверх', () => {
        const stateWithIngredients = createStateWithIngredients();

        const action = moveIngredientUp('id2');
        const state = reducer(stateWithIngredients, action);

        expect(state.ingredients[0].id).toBe('id2');
        expect(state.ingredients[1].id).toBe('id1');
        expect(state.ingredients[2].id).toBe('id3');
      });

      it('не должен перемещать первый элемент вверх', () => {
        const stateWithIngredients = createStateWithIngredients();

        const action = moveIngredientUp('id1');
        const state = reducer(stateWithIngredients, action);

        expect(state.ingredients[0].id).toBe('id1');
        expect(state.ingredients[1].id).toBe('id2');
        expect(state.ingredients[2].id).toBe('id3');
      });
    });

    describe('moveIngredientDown', () => {
      it('должен перемещать ингредиент вниз', () => {
        const stateWithIngredients = createStateWithIngredients();

        const action = moveIngredientDown('id2');
        const state = reducer(stateWithIngredients, action);

        expect(state.ingredients[0].id).toBe('id1');
        expect(state.ingredients[1].id).toBe('id3');
        expect(state.ingredients[2].id).toBe('id2');
      });

      it('не должен перемещать последний элемент вниз', () => {
        const stateWithIngredients = createStateWithIngredients();

        const action = moveIngredientDown('id3');
        const state = reducer(stateWithIngredients, action);

        expect(state.ingredients[0].id).toBe('id1');
        expect(state.ingredients[1].id).toBe('id2');
        expect(state.ingredients[2].id).toBe('id3');
      });
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

    it('должен очищать данные заказа при null', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: {
          _id: 'order1',
          status: 'done',
          name: 'Test Order',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          number: 12345,
          ingredients: []
        }
      };

      const action = setOrderModalData(null);
      const state = reducer(stateWithOrder, action);

      expect(state.orderModalData).toBeNull();
    });
  });

  describe('createOrder extraReducers', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: createOrder.pending.type };
      const state = reducer(initialState, action);

      expect(state.orderRequest).toBe(true);
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const orderData: TOrder = {
        _id: 'order1',
        status: 'done',
        name: 'Test Order',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        number: 12345,
        ingredients: []
      };

      const action = {
        type: createOrder.fulfilled.type,
        payload: orderData
      };

      const stateWithIngredients = {
        ...initialState,
        bun: createMockIngredient({ _id: 'bun1', type: 'bun' }),
        ingredients: [
          { ...createMockIngredient({ _id: 'main1', type: 'main' }), id: 'id1' }
        ]
      };

      const state = reducer(stateWithIngredients, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(orderData);
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен обрабатывать rejected состояние', () => {
      const action = { type: createOrder.rejected.type };
      const stateWithRequest = {
        ...initialState,
        orderRequest: true
      };

      const state = reducer(stateWithRequest, action);

      expect(state.orderRequest).toBe(false);
    });
  });
});

describe('createOrder thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('test-token');
  });

  it('должен вызывать orderBurgerApi с правильными аргументами', async () => {
    const mockOrder = {
      _id: 'order1',
      status: 'done',
      name: 'Test Burger',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 12345,
      ingredients: ['id1', 'id2']
    };

    (orderBurgerApi as jest.Mock).mockResolvedValue({
      success: true,
      order: mockOrder
    });

    const ingredientIds = ['id1', 'id2'];
    const dispatch = jest.fn();
    const getState = jest.fn(() => ({
      burgerConstructor: {
        bun: { _id: 'bun1' },
        ingredients: [{ _id: 'main1' }]
      }
    }));

    const thunk = createOrder(ingredientIds);
    const result = await thunk(dispatch, getState, undefined);

    expect(orderBurgerApi).toHaveBeenCalledWith(ingredientIds);
    expect(result.type).toBe('burgerConstructor/createOrder/fulfilled');
    expect(result.payload).toEqual(mockOrder);
  });

  it('должен возвращать rejected при ошибке API', async () => {
    const error = new Error('API Error');
    (orderBurgerApi as jest.Mock).mockRejectedValue(error);

    const ingredientIds = ['id1', 'id2'];
    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = createOrder(ingredientIds);
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe('burgerConstructor/createOrder/rejected');
    expect((result as any).error?.message).toBe('API Error');
  });
});
