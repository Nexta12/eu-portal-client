import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const serverUrl = process.env.REACT_APP_WS_SERVER || 'ws://0.0.0.0:4000';
  useEffect(() => {
    const socketInstance = io(serverUrl);
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl]);
  return socket;
};
