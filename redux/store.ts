import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import { apiSlice } from "./slices/apiSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;