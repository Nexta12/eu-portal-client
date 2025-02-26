import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const socketInstance = io('ws://localhost:4000');
    // const socketInstance = io('wss://eua.made-n-nigeria.com');
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  return socket;
};
