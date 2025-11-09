import { useEffect, useState } from "react";
import axios from "axios";

interface Asma {
    number: number;
    name: string;
    transliteration: string;
    en: {
        meaning: string;
    };
}

const AsmaPage: React.FC = () => {
    const [names, setNames] = useState<Asma[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchNames = async () => {
            try {
                const res = await axios.get("https://api.aladhan.com/v1/asmaAlHusna");
                setNames(res.data.data as Asma[]);
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
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 p-6 flex flex-col items-center">
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mb-2 tracking-tight">
                    🌿 Asma Al-Husna
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                    The 99 Beautiful Names of Allah (الأسماء الحسنى)
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 w-full max-w-6xl">
                {names.map((item) => (
                    <div
                        key={item.number}
                        className="group bg-white border border-emerald-100 shadow-sm hover:shadow-lg hover:border-emerald-300 rounded-2xl p-5 text-center transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-100/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                            <h3 className="text-2xl font-bold text-emerald-700 relative z-10">
                                {item.name}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-500 italic mt-1">{item.transliteration}</p>
                        <p className="text-gray-700 text-sm mt-2 font-medium">
                            {item.en.meaning}
                        </p>
                        <p className="mt-3 text-xs text-gray-400">#{item.number}</p>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default AsmaPage;
