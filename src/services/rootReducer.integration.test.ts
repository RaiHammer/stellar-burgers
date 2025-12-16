import { rootReducer } from './rootReducer';

describe('rootReducer integration', () => {
  it('should return correct initial state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');

    expect(state.ingredients.ingredients).toEqual([]);
    expect(state.burgerConstructor.bun).toBeNull();
    expect(state.burgerConstructor.ingredients).toEqual([]);
    expect(state.orders.userOrders).toEqual([]);
    expect(state.orders.feedOrders).toEqual([]);
    expect(state.order.orderData).toBeNull();
    expect(state.user.user).toBeNull();
  });
});
