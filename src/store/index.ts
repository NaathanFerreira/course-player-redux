import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { player } from "./slices/player";

export const store = configureStore({
  reducer: {
    player: player,
  },
});

// The ReturnType utility type lets you get the return type of a function type.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
