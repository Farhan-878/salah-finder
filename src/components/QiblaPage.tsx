// src/components/QiblaPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface QiblaResponse {
    data: {
        direction: number;
    };
}

const QiblaPage: React.FC = () => {
    const [angle, setAngle] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position: GeolocationPosition) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await axios.get<QiblaResponse>(
                        `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
                    );
                    setAngle(res.data.data.direction);
                } catch (err) {
                    console.error("Qibla API Error:", err);
                    setError("Failed to fetch Qibla direction.");
                } finally {
                    setLoading(false);
                }
            },
            (err: GeolocationPositionError) => {
                console.error("Geolocation Error:", err);
                setError("Location access denied.");
                setLoading(false);
            }
        );
    }, []);

    if (loading) return <div className="p-4 text-center">Detecting Qibla...</div>;
    if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

    return (
        <div className="flex flex-col items-center justify-center h-[85vh] text-center p-4">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">Qibla Direction</h2>

            <div className="relative w-48 h-48 rounded-full border-4 border-purple-500 flex items-center justify-center">
                {angle !== null && (
                    <div
                        className="absolute w-1 h-20 bg-purple-700 origin-bottom rounded"
                        style={{ transform: `rotate(${angle}deg)` }}
                    />
                )}
                <span className="absolute bottom-3 text-sm text-gray-500">North ↑</span>
            </div>

            {angle !== null && (
                <p className="mt-4 text-gray-700">
                    Direction to Kaaba: <b>{angle.toFixed(2)}°</b>
                </p>
            )}
        </div>
    );
};

export default QiblaPage;