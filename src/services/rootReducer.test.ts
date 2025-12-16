import { rootReducer } from './rootReducer';
import ingredientsReducer from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import { ordersReducer } from './slices/ordersSlices';
import { orderReducer } from './slices/orderSlice';
import userReducer from './slices/userSlice';

describe('rootReducer', () => {
  it('should return initial state for undefined state and unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, { type: '@@INIT' }),
      burgerConstructor: burgerConstructorReducer(undefined, {
        type: '@@INIT'
      }),
      order: orderReducer(undefined, { type: '@@INIT' }),
      orders: ordersReducer(undefined, { type: '@@INIT' }),
      user: userReducer(undefined, { type: '@@INIT' })
    });
  });

  it('should handle initial state correctly', () => {
    const action = { type: '@@INIT' };
    const result = rootReducer(undefined, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('ingredients');
    expect(result).toHaveProperty('burgerConstructor');
    expect(result).toHaveProperty('orders');
    expect(result).toHaveProperty('order');
    expect(result).toHaveProperty('user');
  });
});
