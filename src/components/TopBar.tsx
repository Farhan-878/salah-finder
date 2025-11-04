import { useState } from "react";
import axios from "axios";
import { MapPin, MagnifyingGlass } from "phosphor-react";
import { usePrayerFetcher } from "../hooks/usePrayerFetcher";
import { usePrayerStore } from "../store/usePrayerStore";

const TopBar = () => {
  const [location, setLocation] = useState("Location not selected");
  const [isFetching, setIsFetching] = useState(false);
  const [manualCity, setManualCity] = useState("");
  const setStoreLocation = usePrayerStore((state) => state.setLocation);
  const { fetchPrayerTimes } = usePrayerFetcher();

  // 📍 Auto-detect location
  const handleDetectLocation = () => {
    setIsFetching(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          const address = res.data.address;
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            address.state_district ||
            address.district ||
            address.suburb ||
            address.neighbourhood ||
            "Unknown City";
          const country = address.country || "Unknown Country";
          const fullLocation = `${city}, ${country}`;
          setLocation(fullLocation);
          setStoreLocation(fullLocation);

          // fetch namaz timings
          fetchPrayerTimes(latitude, longitude);
        } catch (error) {
          console.error("Location API Error:", error);
          setLocation("Failed to fetch location");
        } finally {
          setIsFetching(false);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        setLocation("Location access denied");
        setIsFetching(false);
      }
    );
  };

  // 🔍 Manual search by city
  const handleManualSearch = async () => {
    if (!manualCity.trim()) return;
    setIsFetching(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?city=${manualCity}&format=json&limit=1`
      );
      if (res.data.length > 0) {
        const { lat, lon, display_name } = res.data[0];
        setLocation(display_name);
        setStoreLocation(display_name);
        fetchPrayerTimes(lat, lon);
      } else {
        setLocation("City not found");
      }
    } catch (error) {
      console.error("City search error:", error);
      setLocation("Failed to fetch city");
    } finally {
      setIsFetching(false);
      setManualCity("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center p-4 gap-3">
      <img src="/logo.png" alt="Logo" className="h-8 lg:ml-15" />

      <div className="flex flex-wrap items-center gap-3">
        {location === "Location not selected" ? (
          <>
            <button
              onClick={handleDetectLocation}
              className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
            >
              {isFetching ? "Detecting..." : "Detect Location"}
            </button>

            <div className="flex items-center bg-white border rounded-lg shadow-sm overflow-hidden">
              <input
                type="text"
                placeholder="Enter city name..."
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                className="px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={handleManualSearch}
                className="bg-purple-600 text-white px-3 py-2 hover:bg-purple-700 transition"
              >
                <MagnifyingGlass size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border lg:mr-15">
            <MapPin size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
