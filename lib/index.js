var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useState, useEffect, useContext, useCallback } from 'react';
import io from 'socket.io-client';
var SocketIOContext = React.createContext({});
export var SocketIOProvider = function (_a) {
    var children = _a.children;
    return React.createElement(SocketIOContext.Provider, { value: {} }, children);
};
export var useSocketIO = function (name) {
    var sockets = useContext(SocketIOContext);
    var socket = sockets[name];
    var _a = useState(false), socketChange = _a[1];
    var openSocket = useCallback(function (uri, options) {
        if (options === void 0) { options = {}; }
        var defaultOptions = {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1 * 1000,
            reconnectionDelayMax: 10 * 1000,
            autoConnect: true,
            transports: ['polling'],
            rejectUnauthorized: true,
        };
        var mergeOptions = __assign(__assign({}, defaultOptions), options);
        // Remove old socket
        if (socket) {
            socket.disconnect();
            socket.close();
        }
        // New socket
        var newSocket = io.connect(uri, mergeOptions);
        // Add to list
        sockets[name] = newSocket;
        socketChange(function (v) { return !v; });
        return newSocket;
    }, [name, socket, sockets]);
    // Check is connected?
    if (socket && !socket.connected)
        socket.connect();
    return { socket: socket, connectServer: openSocket };
};
export var SocketIOEvent = function (_a) {
    var socket = _a.socket, eventName = _a.eventName, callback = _a.callback;
    useEffect(function () {
        socket && socket.on(eventName, callback);
        return function () {
            socket && socket.off(eventName, callback);
        };
    }, [callback, eventName, socket]);
    return React.createElement(React.Fragment, null);
};
//# sourceMappingURL=index.js.map