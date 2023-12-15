const RECONNECT_PERIOD = 3000;

export const socketMiddleware = (wsActions, withTokenRefresh = false) => {
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
        let isConnected = false;
        let reconnectTimer = 0;
        let url = "";

        return next => action => {
            const { dispatch } = store;
            const { type } = action;

            if (type === wsConnect) {
                url = action.payload;
                socket = new WebSocket(url);
                isConnected = true;
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

                    if (withTokenRefresh && parsedData.message === "Invalid or missing token") {
                        // refreshToken()
                        //     .then(refreshData => {
                        //         const wssUrl = new URL(url);
                        //         wssUrl.searchParams.set(
                        //             "token",
                        //             refreshData.accessToken.replace("Bearer ", "")
                        //         );
                        //         dispatch({type: wsConnect, payload: wssUrl});
                        //     })
                        //     .catch(err => {
                        //         dispatch({type: onError, payload: err.message})
                        //     });
                        //
                        // dispatch({type: wsDisconnect});

                        return;
                    }

                    dispatch({ type: onMessage, payload: parsedData });
                };

                socket.onclose = () => {
                    dispatch({ type: onClose });

                    if (isConnected) {
                        reconnectTimer = window.setTimeout(() => {
                            dispatch({ type: wsConnect, payload: url});
                        }, RECONNECT_PERIOD);
                    }
                };
            }

            if (socket && type === wsSendMessage) {
                socket.send(JSON.stringify(action.payload));
            }

            if (socket && type === wsDisconnect) {
                clearTimeout(reconnectTimer);
                isConnected = false;
                reconnectTimer = 0;
                socket.close();
                socket = null;
            }

            next(action);
        };
    };
};