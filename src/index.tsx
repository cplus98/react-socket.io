import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

interface SocketList {
	[key: string]: SocketIOClient.Socket;
}

interface SocketIOProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}

type SocketIOContextProps = [SocketList, (state: object) => void];

const SocketIOContext = React.createContext<SocketIOContextProps | null>(null);

export const SocketIOProvider = ({ children }: SocketIOProviderProps) => {
	const [sockets, setSockets] = useState({});
	console.log('SOCKETS: ', sockets);

	return <SocketIOContext.Provider value={[sockets, setSockets]}>{children}</SocketIOContext.Provider>;
};

interface useSocketIOResult {
	socket: SocketIOClient.Socket | null;
	connectServer: (uri: string, options: SocketIOClient.ConnectOpts) => void;
	disconnectServer: () => void;
}

export const useSocketIO = (name: string): useSocketIOResult => {
	const [sockets, setSockets] = useContext(SocketIOContext) as SocketIOContextProps;

	const socket = sockets[name];

	const closeSocket = useCallback(() => {
		if (socket) {
			socket.disconnect();
			socket.close();
		}
	}, [socket]);

	const openSocket = useCallback(
		(uri: string, options: any = {}) => {
			if (socket) return socket;

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

			// New socket
			const newSocket = io.connect(uri, mergeOptions);

			// Add to list
			setSockets((s: SocketList) => {
				s[name] = newSocket;
				return _.merge({}, s);
			});

			return newSocket;
		},
		[name, setSockets, socket],
	);

	// Check is connected?
	if (socket && !socket.connected) socket.connect();

	return { socket, connectServer: openSocket, disconnectServer: closeSocket };
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
