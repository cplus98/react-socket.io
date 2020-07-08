"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var react_1 = __importStar(require("react"));
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var SocketIOContext = react_1.default.createContext(null);
exports.SocketIOProvider = function (_a) {
    var children = _a.children;
    var _b = react_1.useState({}), sockets = _b[0], setSockets = _b[1];
    return react_1.default.createElement(SocketIOContext.Provider, { value: [sockets, setSockets] }, children);
};
exports.useSocketIO = function (name) {
    var _a = react_1.useContext(SocketIOContext), sockets = _a[0], setSockets = _a[1];
    var socket = sockets[name];
    var closeSocket = react_1.useCallback(function () {
        if (socket) {
            socket.disconnect();
            socket.close();
        }
    }, [socket]);
    var openSocket = react_1.useCallback(function (uri, options) {
        if (options === void 0) { options = {}; }
        if (socket)
            return socket;
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
        // New socket
        var newSocket = socket_io_client_1.default.connect(uri, mergeOptions);
        // Add to list
        setSockets(function (s) {
            s[name] = newSocket;
            return lodash_1.default.merge({}, s);
        });
        return newSocket;
    }, [name, setSockets, socket]);
    // Check is connected?
    if (socket && !socket.connected)
        socket.connect();
    return { socket: socket, connectServer: openSocket, disconnectServer: closeSocket };
};
exports.SocketIOEvent = function (_a) {
    var socket = _a.socket, eventName = _a.eventName, callback = _a.callback;
    react_1.useEffect(function () {
        socket && socket.on(eventName, callback);
        return function () {
            socket && socket.off(eventName, callback);
        };
    }, [callback, eventName, socket]);
    return react_1.default.createElement(react_1.default.Fragment, null);
};
//# sourceMappingURL=index.js.map