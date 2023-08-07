import { CloudArrowDownIcon } from '@heroicons/react/24/outline';

export function Loader() {
  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <CloudArrowDownIcon className="animate-bounce md:h-48 md:w-48" />
    </div>
  );
}
