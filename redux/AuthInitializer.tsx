"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "./slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("easyshop_user");
    if (stored) {
      dispatch(setCredentials(JSON.parse(stored)));
    }
  }, [dispatch]);

  return null;
}