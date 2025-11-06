import React, { useEffect, useState } from "react";

interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
}

const QuranSurahPlayer: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<number>(1);
    const [bitrate, setBitrate] = useState<number>(128);
    const [audioSrc, setAudioSrc] = useState<string>("");

    const edition = "ar.alafasy";

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const res = await fetch("https://api.alquran.cloud/v1/surah");
                const data = await res.json();
                setSurahs(data.data);
            } catch (error) {
                console.error("Error fetching surahs:", error);
            }
        };
        fetchSurahs();
    }, []);

    const handlePlay = () => {
        const url = `https://cdn.islamic.network/quran/audio-surah/${bitrate}/${edition}/${selectedSurah}.mp3`;
        setAudioSrc(url);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-6 text-emerald-600">
                    📖 Quran Surah Player
                </h2>

                <div className="mb-5 text-left">
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                        Select Surah
                    </label>
                    <select
                        value={selectedSurah}
                        onChange={(e) => setSelectedSurah(Number(e.target.value))}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                        {surahs.map((surah) => (
                            <option key={surah.number} value={surah.number}>
                                {surah.number}. {surah.englishName} ({surah.name}) –{" "}
                                {surah.englishNameTranslation}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-5 text-left">
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                        Audio Quality
                    </label>
                    <select
                        value={bitrate}
                        onChange={(e) => setBitrate(Number(e.target.value))}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                        {[192, 128, 64, 48, 40, 32].map((rate) => (
                            <option key={rate} value={rate}>
                                {rate} kbps
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handlePlay}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-emerald-400/30"
                >
                    ▶ Play Surah
                </button>

                {audioSrc && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <audio controls className="w-full rounded-lg" src={audioSrc}></audio>
                        <p className="text-sm mt-2 text-gray-600">
                            Now playing:{" "}
                            <span className="text-emerald-600 font-medium">
                                Surah {selectedSurah}
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuranSurahPlayer;
