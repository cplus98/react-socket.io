/// <reference types="socket.io-client" />
import React from 'react';
interface SocketIOProviderProps {
    children?: React.ReactNode | React.ReactNode[];
}
export declare const SocketIOProvider: ({ children }: SocketIOProviderProps) => JSX.Element;
interface useSocketIOResult {
    socket: SocketIOClient.Socket;
    connectServer: (uri: string, options: SocketIOClient.ConnectOpts) => void;
}
export declare const useSocketIO: (name: string) => useSocketIOResult;
interface useSocketIOEventProps {
    socket: SocketIOClient.Socket;
    eventName: string;
    callback: (data: any) => void;
}
export declare const SocketIOEvent: ({ socket, eventName, callback }: useSocketIOEventProps) => JSX.Element;
export {};
