import {ActionCreatorWithoutPayload, ActionCreatorWithPayload, Middleware} from "@reduxjs/toolkit";
import {RootState} from "../store";

export type TWsActionTypes = {
    wsConnect: ActionCreatorWithPayload<string>,
    wsDisconnect: ActionCreatorWithoutPayload,
    wsSendMessage?: ActionCreatorWithPayload<any>,
    wsConnecting: ActionCreatorWithoutPayload,
    onOpen: ActionCreatorWithoutPayload,
    onClose: ActionCreatorWithoutPayload,
    onError: ActionCreatorWithPayload<string>,
    onMessage: ActionCreatorWithPayload<any>,
}

export const socketMiddleware = (wsActions: TWsActionTypes): Middleware<{}, RootState> => {
    return store => {
        let socket: WebSocket | null = null;

        return next => action => {
            const {dispatch } = store;
            const {
                wsConnect,
                wsSendMessage,
                onOpen,
                onClose,
                onError,
                onMessage,
                wsConnecting,
                wsDisconnect
            } = wsActions;

            if (wsConnect.match(action)) {
                socket = new WebSocket(action.payload);
                dispatch(wsConnecting());
            }

            if (socket) {
                socket.onopen = () => {
                    dispatch(onOpen());
                };

                socket.onerror = () => {
                    dispatch(onError("Error"));
                };

                socket.onmessage = event => {
                    const {data} = event;
                    const parsedData = JSON.parse(data);

                    dispatch(onMessage(parsedData));
                };

                socket.onclose = () => {
                    dispatch(onClose());
                };

                if (wsSendMessage?.match(action)) {
                    socket.send(JSON.stringify(action.payload));
                }

                if (wsDisconnect.match(action)) {
                    socket.close();
                    socket = null;
                }
            }

            next(action);
        };
    };
};