import { Waveform } from '@uiball/loaders';

export function Loader() {
  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Waveform size={112} color="#FFFFFF" lineWeight={10} />
    </div>
  );
}
