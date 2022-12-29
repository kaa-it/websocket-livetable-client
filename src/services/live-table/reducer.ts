import {LiveTable, WebsocketStatus} from "../../types/live-table";
import {createReducer} from "@reduxjs/toolkit";
import {wsClose, wsConnecting, wsError, wsMessage, wsOpen} from "./actions";
import {liveTableUpdate} from "./live-table-update";

export type LiveTableStore = {
    status: WebsocketStatus,
    table: LiveTable,
    connectingError: string,
}

const initialState: LiveTableStore = {
    status: WebsocketStatus.OFFLINE,
    table: [],
    connectingError: ''
}

export const liveTableReducer = createReducer(initialState, builder => {
    builder
        .addCase(wsConnecting, state => {
            state.status = WebsocketStatus.CONNECTING;
        })
        .addCase(wsOpen, state => {
            state.status = WebsocketStatus.ONLINE;
            state.connectingError = '';
        })
        .addCase(wsClose, state => {
            state.status = WebsocketStatus.OFFLINE;
        })
        .addCase(wsError, (state, action) => {
            state.connectingError = action.payload;
        })
        .addCase(wsMessage, (state, action) => {
            state.table = liveTableUpdate(state.table, action.payload);
        })
})