import { combineReducers } from 'redux';
import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import { ordersReducer } from './slices/ordersSlices';
import { orderReducer } from './slices/orderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: burgerConstructorReducer,
  orders: ordersReducer,
  order: orderReducer
});
