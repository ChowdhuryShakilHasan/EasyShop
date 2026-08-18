"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import AuthInitializer from "./AuthInitializer";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}