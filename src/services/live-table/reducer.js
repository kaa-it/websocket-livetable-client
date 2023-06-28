import {WebsocketStatus} from "../../utils/live-table";
import {
    LIVE_TABLE_WS_CLOSE,
    LIVE_TABLE_WS_CONNECTING,
    LIVE_TABLE_WS_ERROR,
    LIVE_TABLE_WS_MESSAGE,
    LIVE_TABLE_WS_OPEN
} from "./actions";
import {liveTableUpdate} from "./live-table-update";

const initialState = {
    status: WebsocketStatus.OFFLINE,
    table: [],
    connectingError: ''
};

export const liveTableReducer = (state = initialState, action) => {
    switch (action.type)
    {
        case LIVE_TABLE_WS_CONNECTING:
            return {
                ...state,
                status: WebsocketStatus.CONNECTING
            };
        case LIVE_TABLE_WS_OPEN:
            return {
                ...state,
                status: WebsocketStatus.ONLINE,
                connectingError: ''
            };
        case LIVE_TABLE_WS_CLOSE:
            return {
                ...state,
                status: WebsocketStatus.OFFLINE,
            };
        case LIVE_TABLE_WS_ERROR:
            return {
                ...state,
                connectingError: action.payload
            };
        case LIVE_TABLE_WS_MESSAGE:
            return {
                ...state,
                table: liveTableUpdate(state.table, action.payload),
            }
        default:
            return state;
    }
}