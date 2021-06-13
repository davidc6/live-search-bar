import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import dropdownReducer from '../components/Dropdown/dropdownSlice';

export const store = configureStore({
  reducer: {
    dropdown: dropdownReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
