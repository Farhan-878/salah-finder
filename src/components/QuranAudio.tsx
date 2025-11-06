import React, { useEffect, useState } from "react";

interface Surah {
    number: number;
    name: string;
    englishName: string;
    ayahs: number;
}

const QuranAudioPlayer: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<number>(1);
    const [selectedAyah, setSelectedAyah] = useState<number>(1);
    const [bitrate, setBitrate] = useState<number>(128);
    const [audioSrc, setAudioSrc] = useState<string>("");

    const edition = "ar.alafasy"; // default reciter

    // 🔹 Fetch all surahs from Quran API
    useEffect(() => {
        fetch("https://api.alquran.cloud/v1/surah")
            .then((res) => res.json())
            .then((data) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const surahList = data.data.map((s: any) => ({
                    number: s.number,
                    name: s.name,
                    englishName: s.englishName,
                    ayahs: s.numberOfAyahs,
                }));
                setSurahs(surahList);
            });
    }, []);

    // 🔹 Update Ayah list when Surah changes
    const currentSurah = surahs.find((s) => s.number === selectedSurah);
    const ayahList = currentSurah
        ? Array.from({ length: currentSurah.ayahs }, (_, i) => i + 1)
        : [];

    // 🔹 Play selected Ayah
    const handlePlay = () => {
        if (!selectedSurah || !selectedAyah) return;
        // To get correct ayah number globally (1–6236), we can get via API or rough calculation, but simplest:
        const url = `https://cdn.islamic.network/quran/audio/${bitrate}/${edition}/${getGlobalAyahNumber(
            selectedSurah,
            selectedAyah
        )}.mp3`;
        setAudioSrc(url);
    };

    // 🔹 Calculate global Ayah number (1–6236)
    const getGlobalAyahNumber = (surahNum: number, ayahNum: number) => {
        // Pre-calculated cumulative ayah counts for each surah start (1-indexed)
        const cumulative: number[] = [
            0, 7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99,
            128, 111, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
            54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60,
            49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
            44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
            26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3,
            6, 3, 5, 4, 5, 6,
        ];
        const totalBefore = cumulative.slice(0, surahNum - 1).reduce((a, b) => a + b, 0);
        return totalBefore + ayahNum;
    };

    return (
        <div
            style={{
                margin: "40px auto",
                padding: "20px",
                borderRadius: "12px",
                background: "#f3f4f6",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                textAlign: "center",
                width: "340px",
            }}
        >
            <h3 style={{ marginBottom: "12px" }}>📖 Quran Audio Player</h3>

            {/* Surah Selector */}
            <div style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", marginRight: "8px" }}>Surah:</label>
                <select
                    value={selectedSurah}
                    onChange={(e) => {
                        const surahNum = Number(e.target.value);
                        setSelectedSurah(surahNum);
                        setSelectedAyah(1);
                    }}
                    style={{
                        padding: "6px",
                        borderRadius: "6px",
                        width: "230px",
                        border: "1px solid #d1d5db",
                    }}
                >
                    {surahs.map((s) => (
                        <option key={s.number} value={s.number}>
                            {s.number}. {s.englishName} ({s.name})
                        </option>
                    ))}
                </select>
            </div>

            {/* Ayah Selector */}
            <div style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", marginRight: "8px" }}>Ayah:</label>
                <select
                    value={selectedAyah}
                    onChange={(e) => setSelectedAyah(Number(e.target.value))}
                    style={{
                        padding: "6px",
                        borderRadius: "6px",
                        width: "100px",
                        border: "1px solid #d1d5db",
                    }}
                >
                    {ayahList.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bitrate Selector */}
            <div style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", marginRight: "8px" }}>Bitrate:</label>
                <select
                    value={bitrate}
                    onChange={(e) => setBitrate(Number(e.target.value))}
                    style={{
                        padding: "6px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                    }}
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
                style={{
                    padding: "8px 16px",
                    background: "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "15px",
                }}
            >
                ▶ Play Ayah
            </button>

            {/* Audio Player */}
            {audioSrc && (
                <div>
                    <audio controls style={{ width: "100%" }}>
                        <source src={audioSrc} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <p style={{ fontSize: "14px", color: "#4b5563", marginTop: "8px" }}>
                        {surahs.find((s) => s.number === selectedSurah)?.englishName} — Ayah{" "}
                        {selectedAyah} ({bitrate} kbps)
                    </p>
                </div>
            )}
        </div>
    );
};

export default QuranAudioPlayer;
