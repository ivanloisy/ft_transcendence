import { createContext } from 'react';
import io, { Socket } from 'socket.io-client';
import { WebsocketContext } from "./WebSocketContext";
import { WS_URL } from '../config';

export const socket = io(`${WS_URL}/update`);
export const WebsocketContextUpdate = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
/*
export const WebsocketUpdateProvider = ({ children }:{ children:JSX.Element }) => {
    return <WebsocketContextUpdate.Provider value={socket}>{ children }</WebsocketContextUpdate.Provider>;
}
 */
