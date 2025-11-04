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
        <div className="p-4 max-h-[85vh] overflow-y-scroll">
            {(quranData as Array<{
                number: number;
                englishName: string;
                name: string;
                numberOfAyahs: number;
                ayahs: Array<{ number: number; text: string }>
            }>).map((surah) => (
                <div key={surah.number} className="mb-6 border-b pb-3">
                    <h2 className="text-lg font-bold text-purple-700">
                        {surah.number}. {surah.englishName} ({surah.name})
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                        Verses: {surah.numberOfAyahs}
                    </p>
                    <div className="text-right text-gray-800 leading-relaxed text-lg">
                        {surah.ayahs.slice(0, 3).map((ayah) => (
                            <p key={ayah.number}>{ayah.text}</p>
                        ))}
                        <p className="text-xs text-purple-600 mt-1">
                            ... (showing first 3 verses)
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuranSurahs;
