// src/components/AsmaPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const AsmaPage = () => {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNames = async () => {
            try {
                const res = await axios.get("https://api.aladhan.com/v1/asmaAlHusna");
                setNames(res.data.data);
            } catch (err) {
                console.error("Asma Al-Husna API Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNames();
    }, []);

    if (loading) return <div className="p-4 text-center">Loading Asma Al-Husna...</div>;

    return (
        <div className="p-4 max-h-[85vh] overflow-y-scroll bg-gradient-to-b from-purple-50 to-white">
            <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
                Asma Al-Husna (99 Names of Allah)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {names.map((item) => (
                    <div
                        key={item.number}
                        className="bg-white shadow-md rounded-xl p-4 border text-center hover:scale-105 transition-transform duration-300"
                    >
                        <h3 className="text-xl font-bold text-purple-700">{item.name}</h3>
                        <p className="text-sm text-gray-500 italic">{item.transliteration}</p>
                        <p className="text-gray-600 text-sm mt-1">{item.en.meaning}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AsmaPage;
