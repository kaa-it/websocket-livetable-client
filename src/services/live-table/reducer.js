import { createReducer } from '@reduxjs/toolkit';
import { WebsocketStatus } from '../../utils/live-table';
import { liveTableUpdate } from './live-table-update';
import {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage
} from './actions';

const initialState = {
  status: WebsocketStatus.OFFLINE,
  table: [],
  connectingError: ''
}

export const liveTableReducer = createReducer(initialState, (builder) => {
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
      state.table = liveTableUpdate(state.table, action.payload)
    })
})
