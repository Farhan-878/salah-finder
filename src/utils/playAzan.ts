// src/utils/playAzan.ts
export const playAzan = async () => {
    try {
        // Direct working azan audio (can replace with others if you want)
        const audioUrl = "https://cdn.islamic.network/adhan/audio/128/adhan1.mp3";

        // Fetch the file first (download)
        const response = await fetch(audioUrl);
        if (!response.ok) throw new Error("Failed to download Azan audio");

        const audioBlob = await response.blob();
        const audioUrlBlob = URL.createObjectURL(audioBlob);

        // Create audio object and play
        const audio = new Audio(audioUrlBlob);
        await audio.play();

        console.log("✅ Azan started playing successfully");
    } catch (error) {
        console.error("❌ Azan play failed:", error);
    }
};
