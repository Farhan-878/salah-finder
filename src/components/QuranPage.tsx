// src/components/QuranPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const QuranSurahs = () => {
    const [quranData, setQuranData] = useState<Array<{
        number: number;
        englishName: string;
        name: string;
        numberOfAyahs: number;
        ayahs: Array<{ number: number; text: string }>
    }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuran = async () => {
            try {
                const res = await axios.get("https://api.alquran.cloud/v1/quran/quran-uthmani");
                setQuranData(res.data.data.surahs);
            } catch (err) {
                console.error("Failed to fetch Quran:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuran();
    }, []);

    if (loading) return <div className="p-4 text-center">Loading Quran...</div>;

    return (
        <div className="p-6 max-h-[85vh] overflow-y-auto bg-gradient-to-b from-emerald-50 via-white to-emerald-100 rounded-3xl shadow-inner">
            {(quranData as Array<{
                number: number;
                englishName: string;
                name: string;
                numberOfAyahs: number;
                ayahs: Array<{ number: number; text: string }>
            }>).map((surah) => (
                <div
                    key={surah.number}
                    className="mb-6 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5 hover:-translate-y-1 hover:border-emerald-300"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-xl font-bold text-emerald-700">
                                {surah.number}. {surah.englishName}
                            </h2>
                            <p className="text-sm text-gray-500">
                                ({surah.name}) – {surah.numberOfAyahs} Verses
                            </p>
                        </div>
                        <div className="bg-emerald-100 text-emerald-700 font-semibold text-xs px-3 py-1 rounded-full shadow-sm">
                            Surah {surah.number}
                        </div>
                    </div>

                    <div className="text-right leading-relaxed">
                        <div className="bg-gradient-to-r from-emerald-50 to-white p-4 rounded-xl border border-emerald-100">
                            {surah.ayahs.slice(0, 3).map((ayah) => (
                                <p
                                    key={ayah.number}
                                    className="text-gray-800 text-lg font-arabic tracking-wide mb-2"
                                >
                                    {ayah.text}
                                </p>
                            ))}
                            <p className="text-xs text-emerald-600 mt-2 italic">
                                ... showing first 3 verses
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

    );
};

export default QuranSurahs;
