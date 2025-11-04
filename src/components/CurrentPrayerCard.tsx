import { useEffect, useState } from "react";
import { usePrayerStore } from "../store/usePrayerStore";
import { format, parse, differenceInMinutes, isAfter } from "date-fns";
import { CloudSun, Sun, Cloud, CloudMoon, Moon } from "phosphor-react";
import { formatTo12Hour } from "../utils/formatTime";
import { getCurrentPrayerProgress } from "../utils/getCurrentPrayer";
// import { playAzan } from "../utils/playAzan";

// min into hours min 
const formatTimeLeft = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs > 0 ? `${hrs}h ` : ""}${mins}min`;
};





//  current and next prayer
const getCurrentAndNextPrayer = (timings: Record<string, string>) => {
  const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const now = new Date();

  for (let i = 0; i < order.length; i++) {
    const name = order[i];
    const time = parse(timings[name], "HH:mm", new Date());

    if (isAfter(time, now)) {
      const current = i === 0 ? "Isha" : order[i - 1];
      const next = name;
      const diff = differenceInMinutes(time, now);
      return { currentPrayer: current, nextPrayer: next, nextInMinutes: diff };
    }
  }

  const fajrNextDay = parse(
    timings["Fajr"],
    "HH:mm",
    new Date(now.getTime() + 86400000)
  );

  return {
    currentPrayer: "Isha",
    nextPrayer: "Fajr",
    nextInMinutes: differenceInMinutes(fajrNextDay, now),
  };
};

const CurrentPrayerCard = () => {
  const timings = usePrayerStore((state) => state.timings);
  const [progressData, setProgressData] = useState(() =>
    getCurrentPrayerProgress(timings)
  );
  // const [loading, setLoading] = useState<boolean>(false);
  const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const icons = [CloudSun, Sun, Cloud, CloudMoon, Moon];
  const today = format(new Date(), "EEEE");
  const currentDate = format(new Date(), "dd/MM/yyyy");
  const currentTime = format(new Date(), "HH:mm:ss");

  // const handlePlay = async () => {
  //   setLoading(true);
  //   await playAzan();
  //   setLoading(false);
  // };

  // Different background gradients for each prayer (custom colors)
  const prayerBackgrounds = [
    "bg-gradient-to-br from-[#D6BDFF] to-[#3F7CE6]",
    "bg-gradient-to-br from-[#E77715] to-[#FFE392]",
    "bg-gradient-to-br from-[#006C5E] to-[#C9F3B3]",
    "bg-gradient-to-br from-[#FF88A8] to-[#FF9452]",
    "bg-gradient-to-br from-[#811DEC] to-[#381079]"
  ];

  const { currentPrayer, nextPrayer, nextInMinutes } =
    getCurrentAndNextPrayer(timings);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressData(getCurrentPrayerProgress(timings));
    }, 1000); // Update every second for dynamic arc progress
    return () => clearInterval(interval);
  }, [timings]);

  // Get background class based on current prayer
  const getCurrentBackground = () => {
    const currentIndex = prayerNames.indexOf(currentPrayer);
    return currentIndex !== -1 ? prayerBackgrounds[currentIndex] : prayerBackgrounds[4]; // Default to Isha
  };

  // Debugging output
  // console.log("progressData", progressData, timings);

  return (
    <div className={`w-[90%] mx-auto m-4 rounded-2xl p-5 ${getCurrentBackground()} text-white shadow-md`}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = icons[prayerNames.indexOf(currentPrayer)];
              return <Icon size={22} />;
            })()}
            <h1 className="text-2xl font-bold">{currentPrayer}</h1>
          </div>
          <p className="text-xs mt-1">
            Next prayer <b>{nextPrayer}</b> in {formatTimeLeft(nextInMinutes)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs bg-white/20 px-3 py-1 rounded-full">{today}</div>
          <div className="text-xs bg-white/20 px-3 py-1 rounded-full">{currentDate}</div>
          <div className="text-xs bg-white/20 px-3 py-1 rounded-full">{currentTime}</div>
        </div>
        {/* <button
          onClick={handlePlay}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Downloading..." : "Play Azan"}
        </button> */}
      </div>

      {/* Timings List */}
      <div className="grid grid-cols-5 gap-2 text-center mt-6 text-sm">
        {prayerNames.map((name, idx) => {
          const Icon = icons[idx];
          const isActive = name === currentPrayer;

          return (
            <div
              key={name}
              className={`flex flex-col items-center gap-1 ${isActive ? "text-white font-semibold" : "text-white/70"
                }`}
            >
              <Icon size={18} />
              <span className="text-xs">{name}</span>
              <span className="text-xs">
                {timings[name as keyof typeof timings] ? formatTo12Hour(timings[name as keyof typeof timings]) : "--:--"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Arc Progress */}
      {/* Debug info for progressData */}
      {/* <div style={{ color: 'white', textAlign: 'center', fontSize: '12px', marginBottom: '4px' }}>
        Progress: {progressData.progressPercent.toFixed(1)}% | Current: {progressData.currentPrayer} | Index: {progressData.currentIndex}
      </div> */}

      {progressData.currentIndex === -1 ? (
        <div className="text-center text-red-200">Prayer timings not loaded or invalid.</div>
      ) : (
        <div className="relative mt-8 flex items-center justify-center w-full h-[100px]">
          <svg className="absolute w-[90%] h-full" viewBox="0 0 200 100">
            {Array.from({ length: 5 }).map((_, i) => {
              const angle = 180 / 5; // 36 degrees per segment
              const radius = 80;
              const gap = 4; // Gap between segments
              const cx = 100;
              const cy = 100;

              const startAngle = 180 + i * angle + gap / 2;
              const endAngle = startAngle + angle - gap;

              // Different background colors for each prayer
              const prayerColors = [
                "rgba(255, 255, 255, 0.2)",
                "rgba(255, 255, 255, 0.2)",
                "rgba(255, 255, 255, 0.2)",
                "rgba(255, 255, 255, 0.2)",
                "rgba(255, 255, 255, 0.2)"
              ];

              const polarToCartesian = (r: number, a: number) => {
                const rad = (Math.PI * a) / 180;
                return {
                  x: cx + r * Math.cos(rad),
                  y: cy + r * Math.sin(rad),
                };
              };

              const start = polarToCartesian(radius, startAngle);
              const end = polarToCartesian(radius, endAngle);
              const largeArc = endAngle - startAngle <= 180 ? "0" : "1";

              // Determine what type of segment this is
              if (i < progressData.currentIndex) {
                // COMPLETED PRAYERS - Completely WHITE
                return (
                  <path
                    key={i}
                    d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`}
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              } else if (i === progressData.currentIndex && progressData.currentIndex !== -1) {
                // CURRENT PRAYER - Partial WHITE + COLORED BACKGROUND
                const progressAngle = startAngle + ((endAngle - startAngle) * progressData.progressPercent / 100);
                const progressEnd = polarToCartesian(radius, progressAngle);
                const progressLargeArc = progressAngle - startAngle <= 180 ? "0" : "1";

                return (
                  <g key={i}>
                    {/* Background (prayer specific color) */}
                    <path
                      d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`}
                      stroke={prayerColors[i]}
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Progress (white part) */}
                    {progressData.progressPercent > 0 && (
                      <path
                        d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${progressLargeArc} 1 ${progressEnd.x} ${progressEnd.y}`}
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                      />
                    )}
                  </g>
                );
              } else {
                // FUTURE PRAYERS - COLORED BACKGROUND
                return (
                  <path
                    key={i}
                    d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`}
                    stroke={prayerColors[i]}
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              }
            })}
          </svg>

          {/* Center text showing current progress */}

        </div>
      )}
    </div>
  );
};

export default CurrentPrayerCard;