import {configureStore} from "@reduxjs/toolkit";
import {liveTableReducer} from "./live-table/reducer";
import {socketMiddleware} from "./middleware/socket-middleware";
import {
    LIVE_TABLE_CONNECT,
    LIVE_TABLE_DISCONNECT, LIVE_TABLE_WS_CLOSE,
    LIVE_TABLE_WS_CONNECTING, LIVE_TABLE_WS_ERROR, LIVE_TABLE_WS_MESSAGE,
    LIVE_TABLE_WS_OPEN
} from "./live-table/actions";

const liveTableMiddleware = socketMiddleware({
    wsConnect: LIVE_TABLE_CONNECT,
    wsDisconnect: LIVE_TABLE_DISCONNECT,
    wsConnecting: LIVE_TABLE_WS_CONNECTING,
    onOpen: LIVE_TABLE_WS_OPEN,
    onClose: LIVE_TABLE_WS_CLOSE,
    onError: LIVE_TABLE_WS_ERROR,
    onMessage: LIVE_TABLE_WS_MESSAGE
});

export const store = configureStore({
    reducer: {
        liveTable: liveTableReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(liveTableMiddleware)
    }
})