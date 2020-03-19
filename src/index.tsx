import React, { useState, useEffect, useContext, useCallback } from 'react';
import io from 'socket.io-client';

interface SocketList {
	[key: string]: SocketIOClient.Socket;
}

interface SocketIOProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}

const SocketIOContext = React.createContext({});

export const SocketIOProvider = ({ children }: SocketIOProviderProps) => <SocketIOContext.Provider value={{} as SocketList}>{children}</SocketIOContext.Provider>;

interface useSocketIOResult {
	socket: SocketIOClient.Socket;
	connectServer: (uri: string, options: SocketIOClient.ConnectOpts) => void;
}

export const useSocketIO = (name: string): useSocketIOResult => {
	const sockets = useContext(SocketIOContext) as SocketList;
	const socket = sockets[name];

	const [, socketChange] = useState(false);

	const openSocket = useCallback(
		(uri: string, options: any = {}) => {
			const defaultOptions = {
				reconnection: true,
				reconnectionAttempts: Infinity,
				reconnectionDelay: 1 * 1000, // 1 sec
				reconnectionDelayMax: 10 * 1000, // 10 sec
				autoConnect: true,
				transports: ['polling'],
				rejectUnauthorized: true,
			};
			const mergeOptions = { ...defaultOptions, ...options };

			// Remove old socket
			if (socket) {
				socket.disconnect();
				socket.close();
			}

			// New socket
			const newSocket = io.connect(uri, mergeOptions);

			// Add to list
			sockets[name] = newSocket;
			socketChange(v => !v);

			return newSocket;
		},
		[name, socket, sockets],
	);

	// Check is connected?
	if (socket && !socket.connected) socket.connect();

	return { socket, connectServer: openSocket };
};

interface useSocketIOEventProps {
	socket: SocketIOClient.Socket;
	eventName: string;
	callback: (data: any) => void;
}

export const SocketIOEvent = ({ socket, eventName, callback }: useSocketIOEventProps) => {
	useEffect(() => {
		socket && socket.on(eventName, callback);

		return () => {
			socket && socket.off(eventName, callback);
		};
	}, [callback, eventName, socket]);

	return <></>;
};
