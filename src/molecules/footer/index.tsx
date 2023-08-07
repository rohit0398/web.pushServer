import { useRouter } from 'next/router';

import {
  FacebookIcon,
  InstagramIcon,
  LinkdinIcon,
  LogoWhiteIcon,
  TwitterIcon,
} from '@/public/assets/svg-icons';

export function Footer() {
  const { push } = useRouter();
  return (
    <div className=" container bg-navy-blue">
      <div className="grid grid-cols-3 p-5 text-[.8125rem] font-bold text-white">
        <div className=" flex flex-col gap-2">
          <span className=" cursor-pointer">Startups</span>
          <span className=" cursor-pointer">Investors</span>
          <span className=" cursor-pointer">Deals</span>
        </div>
        <div className=" flex flex-col items-stretch gap-2 pl-[20%]">
          <span className=" cursor-pointer">Jobs</span>
          <span className=" cursor-pointer">Blog</span>
          <span className=" cursor-pointer">About</span>
        </div>
        <div className=" flex flex-col items-end justify-between">
          <span className="">
            Language: <span className=" cursor-pointer">ENG</span>
          </span>
          <div className=" flex cursor-pointer justify-between gap-1">
            <LinkdinIcon /> <InstagramIcon /> <FacebookIcon /> <TwitterIcon />
          </div>
        </div>
      </div>

      <div
        onClick={() => push('/')}
        className=" mt-3 flex cursor-pointer items-center gap-3 px-5 pb-6 text-white"
      >
        <LogoWhiteIcon />
        <div className=" flex flex-col">
          <span className=" text-xl font-normal leading-4">startups</span>
          <span className=" text-xl font-bold">galaxy</span>
        </div>
      </div>
    </div>
  );
}
