import React, { createContext, useContext, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { WS_URL } from '../config';

export const socket: Socket = io(`${WS_URL}/update`);
export const updateSocket: Socket = socket;

export const WebsocketContextUpdate = createContext<Socket>(socket);

export const useWebsocketUpdate = (): Socket => useContext(WebsocketContextUpdate);

export const WebsocketUpdateProvider = ({ children }: { children: ReactNode }) => {
    return (
        <WebsocketContextUpdate.Provider value={socket}>
            {children}
        </WebsocketContextUpdate.Provider>
    );
};
