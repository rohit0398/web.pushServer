import { LogoWhiteIcon } from '@/public/assets/svg-icons';

export function Loader() {
  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <LogoWhiteIcon className="animate-bounce md:h-48 md:w-48" />
    </div>
  );
}
