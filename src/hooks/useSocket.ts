import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const socketInstance = io('ws://localhost:4000');
        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        };
    }, []);
    return socket;
};