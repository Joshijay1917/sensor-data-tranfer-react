import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State to hold sensor data
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [accelSupport, setAccelSupport] = useState(true)
  const [gyroSupport, setGyroSupport] = useState(true)

  // useEffect(() => {
  //   if (navigator.secureContext) {
  //     console.log("✅ Context is secure. Sensor APIs should be available.");
  //   } else {
  //     console.error("❌ Context is NOT secure. This is the problem.");
  //     console.log("Current location:", window.location.href);
  //   }
  // }, []);

  // Function to request permission and start sensors
  const startSensors = () => {
    // Check for HTTPS context
    // if (!navigator.secureContext) {
    //   alert("Sensor APIs require a secure (HTTPS) connection.");
    //   setIsSupported(false);
    //   return;
    // }

    // --- Accelerometer ---
    try {
      const accelerometer = new Accelerometer({ frequency: 60 });
      accelerometer.addEventListener("reading", () => {
        setAccelData({
          x: accelerometer.x,
          y: accelerometer.y,
          z: accelerometer.z,
        });
      });
      accelerometer.addEventListener("error", (event) => {
        setAccelSupport(false)
        if (event.error.name === "NotAllowedError") {
          alert("Permission to access sensor was denied.");
        } else if (event.error.name === "NotReadableError") {
          alert("Cannot connect to the sensor.");
        }
      });
      accelerometer.start();
    } catch (error) {
      setAccelSupport(false)
        if (error.name === "SecurityError") {
            alert("Sensor construction was blocked by a feature policy.");
        } else if (error.name === "ReferenceError") {
            alert("Sensor is not supported by the User Agent.");
        } else {
            alert(error);
        }
    }


    // --- Gyroscope ---
    try {
      const gyroscope = new Gyroscope({ frequency: 60 });
      gyroscope.addEventListener("reading", () => {
        setGyroData({
          x: gyroscope.x,
          y: gyroscope.y,
          z: gyroscope.z,
        });
      });
       gyroscope.addEventListener("error", (event) => {
         setGyroSupport(false)
        console.error("Gyroscope error:", event.error.name, event.error.message);
      });
      gyroscope.start();
    } catch (error) {
      setGyroSupport(false)
        console.error("Gyroscope could not be initialized:", error);
    }
  };

  return (
    <div className="container">
      <h1>Sensor Data</h1>
      <p>
        View this page on your Android phone's browser (like Chrome) and press the button to start reading sensor data.
      </p>
      
      <button onClick={startSensors} className="start-button">
        Start Sensors
      </button>

      {!accelSupport && <p className="error">Cannot connect to Accelerometer.</p>}
      {!gyroSupport && <p className="error">Cannot connect to GyroScope.</p>}

      <div className="sensor-grid">
        <div className="card">
          <h2>Accelerometer</h2>
          <p>Measures acceleration force (m/s²)</p>
          <div className="data">
            <strong>X:</strong> {accelData.x?.toFixed(3)}
          </div>
          <div className="data">
            <strong>Y:</strong> {accelData.y?.toFixed(3)}
          </div>
          <div className="data">
            <strong>Z:</strong> {accelData.z?.toFixed(3)}
          </div>
        </div>

        <div className="card">
          <h2>Gyroscope</h2>
          <p>Measures orientation and angular velocity (rad/s)</p>
          <div className="data">
            <strong>X:</strong> {gyroData.x?.toFixed(3)}
          </div>
          <div className="data">
            <strong>Y:</strong> {gyroData.y?.toFixed(3)}
          </div>
          <div className="data">
            <strong>Z:</strong> {gyroData.z?.toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;