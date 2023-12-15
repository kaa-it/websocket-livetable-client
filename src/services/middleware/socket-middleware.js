const RECONNECT_PERIOD = 3000;

export const socketMiddleware = (wsActions, withTokenRefresh = false) => {
  return (store) => {
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

    return (next) => (action) => {
      const { dispatch } = store;

      if (wsConnect.match(action)) {
        url = action.payload;
        socket = new WebSocket(url);
        isConnected = true;
        dispatch(wsConnecting());

          socket.onopen = () => {
              dispatch(onOpen());
          };

          socket.onerror = (event) => {
              dispatch(onError('Error'));
          };

          socket.onmessage = (event) => {
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
                  //         dispatch(wsConnect(wssUrl));
                  //     })
                  //     .catch(err => {
                  //         dispatch(onError(err.message))
                  //     });
                  //
                  // dispatch(wsDisconnect());

                  return;
              }

              dispatch(onMessage(parsedData));
          };

          socket.onclose = (event) => {
              dispatch(onClose());

              if (isConnected) {
                  reconnectTimer = window.setTimeout(() => {
                      dispatch(wsConnect(url));
                  }, RECONNECT_PERIOD);
              }
          };
      }

      if (socket && wsSendMessage && wsSendMessage.match(action)) {
        socket.send(JSON.stringify(action.payload));
      }

      if (socket && wsDisconnect.match(action)) {
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
