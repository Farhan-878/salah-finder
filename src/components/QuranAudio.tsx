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
        <div className=" flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-6">
            <div className="bg-white/90 backdrop-blur-lg border border-gray-100 rounded-3xl shadow-2xl p-8 w-full max-w-md text-center transition-all duration-300 hover:shadow-emerald-100">
                <h2 className="text-3xl font-bold mb-6 text-emerald-600 tracking-tight">
                    📖 Quran Surah Player
                </h2>

                {/* Surah Selection */}
                <div className="mb-6 text-left">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Select Surah
                    </label>
                    <div className="relative">
                        <select
                            value={selectedSurah}
                            onChange={(e) => setSelectedSurah(Number(e.target.value))}
                            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        >
                            {surahs.map((surah) => (
                                <option key={surah.number} value={surah.number}>
                                    {surah.number}. {surah.englishName} ({surah.name}) –{" "}
                                    {surah.englishNameTranslation}
                                </option>
                            ))}
                        </select>
                        <svg
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            width={18}
                            height={18}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                </div>

                {/* Audio Quality */}
                <div className="mb-6 text-left">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Audio Quality
                    </label>
                    <select
                        value={bitrate}
                        onChange={(e) => setBitrate(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                        {[192, 128, 64, 48, 40, 32].map((rate) => (
                            <option key={rate} value={rate}>
                                {rate} kbps
                            </option>
                        ))}
                    </select>
                </div>

                {/* Play Button */}
                <button
                    onClick={handlePlay}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-emerald-200 transition-all duration-300"
                >
                    ▶ Play Surah
                </button>

                {/* Audio Player */}
                {audioSrc && (
                    <div className="mt-8 bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-inner">
                        <audio
                            controls
                            className="w-full rounded-lg focus:outline-none"
                            src={audioSrc}
                        ></audio>
                        <p className="text-sm mt-3 text-gray-700">
                            Now playing:{" "}
                            <span className="text-emerald-600 font-semibold">
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
