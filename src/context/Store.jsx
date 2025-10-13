import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export const Store = createContext()

export const getStoreData = () => {
    return useContext(Store)
}

export function StoreProvider ({ children }) {
    const [status, setStatus] = useState(null);
    const [acceleData, setacceleData] = useState({
        x: 0,
        y: 0,
        z: 0
    })
    const [gyroData, setGyroData] = useState({
        x: 0,
        y: 0,
        z: 0
    })
    const socketRef = useRef(null);
    // This ref will hold a "live" copy of your data
    const dataRef = useRef({ acceleData, gyroData });

    useEffect(() => {
      dataRef.current = { acceleData, gyroData };
    }, [acceleData, gyroData]);

    useEffect(() => {
  setStatus('Connecting....');
  const socket = io('https://sensor-data-backend-unity.onrender.com');
  socketRef.current = socket;

  let intervalId; // To hold the interval ID

  socket.on('connect', () => {
    setStatus('Connected');

    // Start sending data only after we are connected
    intervalId = setInterval(() => {
      // The interval callback ALWAYS reads the LATEST data from the ref
      socket.emit('sensors', dataRef.current);
      setStatus('Sending data...');
    }, 500);
  });

  socket.on('disconnect', () => {
    setStatus('Disconnected');
    // Important: Stop the interval if we get disconnected
    clearInterval(intervalId);
  });

  // The cleanup function runs when the component is unmounted
  return () => {
    clearInterval(intervalId);
    socket.disconnect();
  };
}, []);
    

    const values = {
        status,
        setacceleData,
        setGyroData,
        setStatus
    }

    return (
        <Store.Provider value={values}>
            {children}
        </Store.Provider>
    )
}
