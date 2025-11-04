import { parse, isValid, differenceInMinutes } from "date-fns";

export const getCurrentPrayerProgress = (timings: Record<string, string>) => {
  const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const now = new Date();

  // Edge case: If timings are missing or invalid, return safe defaults
  if (!timings || prayerOrder.some((name) => !timings[name] || timings[name] === "")) {
    return {
      currentPrayer: "",
      progressPercent: 0,
      currentIndex: -1,
    };
  }

  // Parse all prayer times for today
  const prayerTimes = prayerOrder.map(name => ({
    name,
    time: parse(timings[name], "HH:mm", new Date())
  }));

  // Check each prayer to see if we're currently in its time period
  for (let i = 0; i < prayerOrder.length; i++) {
    const currentPrayer = prayerTimes[i];
    let nextPrayer;
    
    if (i === prayerOrder.length - 1) {
      // Isha: next is Fajr tomorrow
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      nextPrayer = {
        name: "Fajr",
        time: parse(timings["Fajr"], "HH:mm", tomorrow)
      };
    } else {
      nextPrayer = prayerTimes[i + 1];
    }

    // Check if parsing was successful
    if (!isValid(currentPrayer.time) || !isValid(nextPrayer.time)) continue;

    // Check if current time is after this prayer time and before next prayer time
    if (now >= currentPrayer.time && now < nextPrayer.time) {
      const totalMinutes = differenceInMinutes(nextPrayer.time, currentPrayer.time);
      const elapsedMinutes = differenceInMinutes(now, currentPrayer.time);
      const progressPercent = totalMinutes > 0 ? Math.min(Math.max((elapsedMinutes / totalMinutes) * 100, 0), 100) : 0;

      return {
        currentPrayer: currentPrayer.name,
        progressPercent,
        currentIndex: i,
      };
    }
  }

  // If we're before Fajr (early morning), we're still in Isha period from yesterday
  const fajrToday = parse(timings["Fajr"], "HH:mm", new Date());
  if (now < fajrToday) {
    // Calculate Isha to Fajr progress
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const ishaYesterday = parse(timings["Isha"], "HH:mm", yesterday);
    
    if (isValid(ishaYesterday)) {
      const totalMinutes = differenceInMinutes(fajrToday, ishaYesterday);
      const elapsedMinutes = differenceInMinutes(now, ishaYesterday);
      const progressPercent = totalMinutes > 0 ? Math.min(Math.max((elapsedMinutes / totalMinutes) * 100, 0), 100) : 0;
      
      return {
        currentPrayer: "Isha",
        progressPercent,
        currentIndex: 4,
      };
    }
  }

  // Default fallback
  return {
    currentPrayer: "Isha",
    progressPercent: 0,
    currentIndex: 4,
  };
};