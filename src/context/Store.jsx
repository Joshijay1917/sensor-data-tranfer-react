import { createContext, useContext, useEffect, useState } from "react";
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

    useEffect(() => {
        setStatus("Connecting....")
      const socket = io("https://sensor-data-backend-unity.onrender.com")

      const interval = setInterval(() => {
          setStatus("Sending Data...")
        socket.emit("sensors",{acceleData, gyroData})
      }, 500);

      return () => {
        clearInterval(interval)
        socket.disconnect()
    }
    }, [])
    

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
