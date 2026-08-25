import { createContext } from 'react';
import io, { Socket } from 'socket.io-client';
import { WS_URL } from '../config';

export const socket = io(`${WS_URL}/game`);
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
