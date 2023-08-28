import {
  Bars3Icon,
  ChartPieIcon,
  FunnelIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

import { CustomLink } from '@/atoms';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isLarge = useWindowDimensions()?.innerWidth > 640;

  const toggleSidebar = () => {
    setIsOpen((bool) => !bool);
  };

  const navs = [
    { name: 'Dashboard', icon: <ChartPieIcon className="mr-1.5 h-6 w-6" /> },
    {
      name: 'Campaigns',
      icon: <PaperAirplaneIcon className="mr-1.5 h-6 w-6" />,
    },
    { name: 'Creatives', icon: <PhotoIcon className="mr-1.5 h-6 w-6" /> },
    { name: 'Feeds', icon: <FunnelIcon className="mr-1.5 h-6 w-6" /> },
  ];

  return (
    <div
      className={` relative h-auto w-full shrink-0 sm:h-screen ${
        isOpen ? 'sm:w-auto' : 'sm:w-20'
      } bg-dark-purple text-white transition-transform`}
    >
      <div className=" flex w-full items-center justify-between p-4">
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
        <ul className="absolute inset-x-0 top-[5.75rem] z-20 flex flex-col gap-6 rounded-b-2xl bg-dark-purple p-4 sm:relative sm:top-0">
          {navs.map((val, ind) => (
            <li key={ind}>
              <CustomLink
                href={val.name?.toLowerCase()}
                text={isOpen ? val.name : ''}
              >
                {val.icon}
              </CustomLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
