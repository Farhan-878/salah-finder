import { create } from "zustand";
import { persist } from "zustand/middleware";

type PrayerTimings = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

interface PrayerState {
  location: string;
  timings: PrayerTimings;
  setLocation: (location: string) => void;
  setTimings: (timings: PrayerTimings) => void;
}

export const usePrayerStore = create<PrayerState>()(
  persist(
    (set) => ({
      location: "",
      timings: {
        Fajr: "",
        Dhuhr: "",
        Asr: "",
        Maghrib: "",
        Isha: "",
      },
      setLocation: (location) => set({ location }),
      setTimings: (timings) => set({ timings }),
    }),
    {
      name: "prayer-storage", 
    }
  )
);
