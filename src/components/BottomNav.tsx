import { useState } from "react";
import { House, BookOpen, Compass, Handshake, Star } from "phosphor-react";
import QuranPage from "./QuranPage";
import QiblaPage from "./QiblaPage";
import AsmaPage from "./AsmaPage";

const tabs = [
  { name: "Home", icon: House },
  { name: "Quran", icon: BookOpen },
  { name: "Qibla", icon: Compass },
  { name: "Asma", icon: Star },
  { name: "Dua", icon: Handshake },
];

const BottomTabBar = () => {
  const [active, setActive] = useState("Home");

  const renderContent = () => {
    switch (active) {
      case "Quran":
        return <QuranPage />;
      case "Qibla":
        return <QiblaPage />;
      case "Asma":
        return <AsmaPage />;
      case "Dua":
        return <div className="p-4 text-center">Dua Page</div>;
      default:
        return <div className="p-4 text-center">Home Page</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>

      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg py-2 border-t rounded-t-2xl">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActive(tab.name)}
                className="flex flex-col items-center text-xs focus:outline-none"
              >
                <Icon
                  size={22}
                  className={isActive ? "text-purple-600" : "text-gray-400"}
                />
                <span
                  className={
                    isActive ? "text-purple-600 font-medium" : "text-gray-400"
                  }
                >
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomTabBar;
