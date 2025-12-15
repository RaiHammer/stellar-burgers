import { orderReducer as reducer } from './orderSlice';

describe('orderSlice reducer', () => {
  const initialState = reducer(undefined, { type: '@@INIT' });

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  // Тест для неизвестного экшена
  it('должен возвращать текущее состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = reducer(initialState, action);
    expect(state).toEqual(initialState);
  });
});
