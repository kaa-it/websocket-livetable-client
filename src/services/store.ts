import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { liveTableReducer } from "./live-table/reducer";
import { socketMiddleware } from "./middleware/socket-middleware";
import {
  connect as LiveTableWsConnect,
  disconnect as LiveTableWsDisconnect,
  wsOpen as LiveTableWsOpen,
  wsClose as LiveTableWsClose,
  wsMessage as LiveTableWsMessage,
  wsError as LiveTableWsError,
  wsConnecting as LiveTableWsConnecting,
  TLiveTableActions,
} from "./live-table/actions";
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from "react-redux";

import type {} from "redux-thunk/extend-redux";

const reducer = combineReducers({
  liveTable: liveTableReducer,
});

export type RootState = ReturnType<typeof reducer>;

const liveTableMiddleware = socketMiddleware({
  wsConnect: LiveTableWsConnect,
  wsDisconnect: LiveTableWsDisconnect,
  wsConnecting: LiveTableWsConnecting,
  onOpen: LiveTableWsOpen,
  onClose: LiveTableWsClose,
  onError: LiveTableWsError,
  onMessage: LiveTableWsMessage,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(liveTableMiddleware);
  },
});

//export type AppDispatch = typeof store.dispatch;

export type AppActions = TLiveTableActions;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AppActions
>;

type AppDispatch<TReturnType = void> = (
  action: AppActions | AppThunk<TReturnType>
) => TReturnType;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
