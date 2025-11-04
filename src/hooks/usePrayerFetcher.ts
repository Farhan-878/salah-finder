import axios from "axios";
import { usePrayerStore } from "../store/usePrayerStore";
import { playAzan } from "../utils/playAzan";

export const usePrayerFetcher = () => {
  const setTimings = usePrayerStore((state) => state.setTimings);

  const fetchPrayerTimes = async (lat: number, lon: number) => {
    try {
      const res = await axios.get(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`
      );

      const timings = res.data.data.timings;
      console.log("Fetched Timings:", timings);

      setTimings({
        Fajr: timings.Fajr,
        Dhuhr: timings.Dhuhr,
        Asr: timings.Asr,
        Maghrib: timings.Maghrib,
        Isha: timings.Isha,
      });

      scheduleNextAzan(timings);
    } catch (error) {
      console.error("Failed to fetch prayer times", error);
    }
  };

  // 🕒 Schedule Azan for the next prayer only
  const scheduleNextAzan = (timings: Record<string, string>) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // e.g., 2025-11-04

    const prayerTimes = Object.entries(timings).map(([name, time]) => {
      const [hour, minute] = time.split(":").map(Number);
      const prayerDate = new Date(today);
      prayerDate.setHours(hour, minute, 0, 0);
      return { name, time: prayerDate };
    });

    // Find next prayer after current time
    const upcoming = prayerTimes.find((p) => p.time > now);

    if (!upcoming) {
      console.log("All prayers done for today.");
      return;
    }

    const diff = upcoming.time.getTime() - now.getTime();

    console.log(
      `Next Azan scheduled for ${upcoming.name} at ${upcoming.time.toLocaleTimeString()}`
    );

    // Schedule Azan playback
    setTimeout(() => {
      console.log(`⏰ Playing Azan for ${upcoming.name}`);
      playAzan();
    }, diff);
  };

  return { fetchPrayerTimes };
};
