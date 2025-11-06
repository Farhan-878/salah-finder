import React, { useEffect, useState } from "react";
import direction from '../assets/Qibla-arrow.jpg'


const QiblaCompassPage: React.FC = () => {
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [userDirection, setUserDirection] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // Get user's geolocation and fetch Qibla direction
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
                        setError("Failed to fetch Qibla direction");
                    }
                },
                () => setError("Unable to access location")
            );
        } else {
            setError("Geolocation not supported by your browser");
        }
    }, []);

    // Track device compass (rotation)
    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.alpha !== null) setUserDirection(event.alpha);
        };

        window.addEventListener("deviceorientationabsolute", handleOrientation, true);
        window.addEventListener("deviceorientation", handleOrientation, true);

        return () => {
            window.removeEventListener("deviceorientationabsolute", handleOrientation);
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    if (error)
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

    if (qiblaDirection === null)
        return <p style={{ textAlign: "center" }}>Fetching Qibla direction...</p>;

    const rotation = qiblaDirection - userDirection;

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                background: "#f3f4f6",
            }}
        >
            <h2 style={{ marginBottom: "20px" }}>🧭 Qibla Compass</h2>

            <div
                style={{
                    position: "relative",
                    width: "220px",
                    height: "220px",
                    borderRadius: "50%",
                    border: "8px solid #6366f1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "white",
                    boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
                }}
            >
                <img
                    src={direction}
                    alt="Kaaba"
                    style={{
                        position: "absolute",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        transform: `rotate(${rotation}deg) translateY(-90px)`,
                        transformOrigin: "center center",
                        transition: "transform 0.5s ease",
                    }}
                />
                <span style={{ fontWeight: "bold", color: "#111827" }}>N</span>
            </div>

            <p style={{ marginTop: "20px", color: "#4b5563" }}>
                Qibla Direction: <b>{qiblaDirection.toFixed(2)}°</b> from North
            </p>
        </div>
    );
};

export default QiblaCompassPage;
