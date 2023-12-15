export const socketMiddleware = (wsActions) => {
    return store => {
        let socket = null;
        const {
            wsConnect,
            wsSendMessage,
            onOpen,
            onClose,
            onError,
            onMessage,
            wsConnecting,
            wsDisconnect,
        } = wsActions;

        return next => action => {
            const { dispatch } = store;
            const { type } = action;

            if (type === wsConnect) {
                socket = new WebSocket(action.payload);
                dispatch({type: wsConnecting});

                socket.onopen = () => {
                    dispatch({ type: onOpen });
                };

                socket.onerror = () => {
                    dispatch({ type: onError, payload: 'Error' });
                };

                socket.onmessage = event => {
                    const { data } = event;
                    const parsedData = JSON.parse(data);

                    dispatch({ type: onMessage, payload: parsedData });
                };

                socket.onclose = () => {
                    dispatch({ type: onClose });
                };
            }

            if (socket && type === wsSendMessage) {
                socket.send(JSON.stringify(action.payload));
            }

            if (socket && type === wsDisconnect) {
                socket.close();
                socket = null;
            }

            next(action);
        };
    };
};