import { rootReducer } from './rootReducer';
import { UnknownAction } from 'redux';

describe('rootReducer', () => {
  it('должен корректно инициализироваться с undefined состоянием', () => {
    const unknownAction: UnknownAction = { type: 'UNKNOWN_ACTION' };
    const resultState = rootReducer(undefined, unknownAction);
    
    expect(resultState).toEqual({
      burgerConstructor: expect.any(Object),
      ingredients: expect.any(Object),
      order: expect.any(Object),
      orders: expect.any(Object),
      user: expect.any(Object)
    });
  });

  it('должен возвращать текущее состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const unknownAction: UnknownAction = { type: 'UNKNOWN_ACTION' };
    const resultState = rootReducer(initialState, unknownAction);
    
    expect(resultState).toEqual(initialState);
  });
});
