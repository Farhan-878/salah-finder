import React, { useEffect, useState } from "react";
import direction from '../assets/Qibla-arrow.jpg'

const QiblaCompassPage: React.FC = () => {
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [compassHeading, setCompassHeading] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Get user location and fetch Qibla direction
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
                        );
                        const data = await response.json();
                        setQiblaDirection(data.data.direction);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (err) {
                        setError("Failed to fetch Qibla direction.");
                    }
                },
                () => setError("Unable to access location.")
            );
        } else {
            setError("Geolocation not supported by your browser.");
        }
    }, []);

    // 🔹 Detect device orientation (Compass rotation)
    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.absolute && event.alpha !== null) {
                setCompassHeading(event.alpha);
            } else if (event.alpha !== null) {
                setCompassHeading(event.alpha);
            }
        };

        window.addEventListener("deviceorientationabsolute", handleOrientation, true);
        window.addEventListener("deviceorientation", handleOrientation, true);

        return () => {
            window.removeEventListener("deviceorientationabsolute", handleOrientation);
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    if (error) {
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    }

    if (qiblaDirection === null) {
        return <p style={{ textAlign: "center" }}>Fetching Qibla direction...</p>;
    }

    // 🔹 Calculate relative rotation (Qibla - Compass)
    const rotation = qiblaDirection - compassHeading;

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "#f9fafb",
                fontFamily: "sans-serif",
            }}
        >
            <h2 style={{ marginBottom: "16px", color: "#111827" }}>🧭 Live Qibla Compass</h2>

            {/* Compass Circle */}
            <div
                style={{
                    position: "relative",
                    width: "260px",
                    height: "260px",
                    borderRadius: "50%",
                    border: "10px solid #6366f1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "white",
                    boxShadow: "0 0 20px rgba(99,102,241,0.2)",
                }}
            >
                {/* Qibla Pointer */}
                {/* <div
                    style={{
                        position: "absolute",
                        width: "6px",
                        height: "100px",
                        background: "#ef4444",
                        borderRadius: "3px",
                        transform: `rotate(${rotation}deg) translateY(-50px)`,
                        transformOrigin: "bottom center",
                        transition: "transform 0.3s ease",
                    }}
                ></div> */}

                {/* Kaaba Icon */}
                <img
                    src={direction}
                    alt="Kaaba"
                    style={{
                        position: "absolute",
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        transform: `rotate(${rotation}deg) translateY(-100px)`,
                        transformOrigin: "center center",
                        transition: "transform 0.3s ease",
                    }}
                />

                {/* North Label */}
                <span style={{ fontWeight: "bold", color: "#111827" }}>N</span>
            </div>

            {/* Degree Display */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <p style={{ fontSize: "18px", color: "#1f2937" }}>
                    📍 Compass Heading: <b>{compassHeading.toFixed(1)}°</b>
                </p>
                <p style={{ fontSize: "18px", color: "#1f2937" }}>
                    🕋 Qibla Direction: <b>{qiblaDirection.toFixed(1)}°</b> from North
                </p>
            </div>
        </div>
    );
};

export default QiblaCompassPage;
