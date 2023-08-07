import { CustomLink } from "@/atoms";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { useState } from "react";
import {
  ChartPieIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  FunnelIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isLarge = useWindowDimensions()?.innerWidth > 640;

  const toggleSidebar = () => {
    setIsOpen((bool) => !bool);
  };

  const navs = [
    { name: "Dashboard", icon: <ChartPieIcon className="h-6 w-6 mr-1.5" /> },
    {
      name: "Campaigns",
      icon: <PaperAirplaneIcon className="h-6 w-6 mr-1.5" />,
    },
    { name: "Creatives", icon: <PhotoIcon className="h-6 w-6 mr-1.5" /> },
    { name: "Feeds", icon: <FunnelIcon className="h-6 w-6 mr-1.5" /> },
  ];

  return (
    <div
      className={` relative shrink-0 h-auto w-full sm:h-screen ${
        isOpen ? "sm:w-auto" : "sm:w-20"
      } bg-gray-800 text-white bg-dark-purple transition-transform transform`}
    >
      <div className=" flex justify-between items-center w-full p-4">
        {(isOpen || !isLarge) && (
          <header className="py-4">
            <h1 className="text-lg font-bold">Menu</h1>
          </header>
        )}
        <button className=" w-6" onClick={toggleSidebar}>
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>
      {(isOpen || isLarge) && (
        <ul className="flex flex-col gap-6 p-4 absolute top-[5.75rem] left-0 right-0 z-50 bg-dark-purple rounded-b-2xl sm:relative sm:top-0">
          {navs.map((val, ind) => (
            <li key={ind}>
              <CustomLink href={val.name?.toLowerCase()} text={isOpen ? val.name : ""}>
                {val.icon}
              </CustomLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
