import { liveTableReducer } from "./live-table/reducer";
import { configureStore } from "@reduxjs/toolkit";
import { socketMiddleware } from './middleware/socket-middleware.js';
import {
  connect as LiveTableWsConnect,
  disconnect as LiveTableWsDisconnect,
  wsOpen as LiveTableWsOpen,
  wsClose as LiveTableWsClose,
  wsMessage as LiveTableWsMessage,
  wsError as LiveTableWsError,
  wsConnecting as LiveTableWsConnecting
} from "./live-table/actions";

const liveTableNiddleware = socketMiddleware({
  wsConnect: LiveTableWsConnect,
  wsDisconnect: LiveTableWsDisconnect,
  wsConnecting: LiveTableWsConnecting,
  onOpen: LiveTableWsOpen,
  onClose: LiveTableWsClose,
  onError: LiveTableWsError,
  onMessage: LiveTableWsMessage,
})

export const store = configureStore({
  reducer: {
    liveTable: liveTableReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(liveTableNiddleware);
  }
});
