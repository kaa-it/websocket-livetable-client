export const LIVE_TABLE_CONNECT = 'LIVE_TABLE_CONNECT';
export const LIVE_TABLE_DISCONNECT = 'LIVE_TABLE_DISCONNECT';
export const LIVE_TABLE_WS_CONNECTING = 'LIVE_TABLE_WS_CONNECTING';
export const LIVE_TABLE_WS_OPEN = 'LIVE_TABLE_WS_OPEN';
export const LIVE_TABLE_WS_CLOSE = 'LIVE_TABLE_WS_CLOSE';
export const LIVE_TABLE_WS_MESSAGE = 'LIVE_TABLE_WS_MESSAGE';
export const LIVE_TABLE_WS_ERROR = 'LIVE_TABLE_WS_ERROR';

export const connect = (url) => ({
    type: LIVE_TABLE_CONNECT,
    payload: url
});

export const disconnect = () => ({
    type: LIVE_TABLE_DISCONNECT,
});
