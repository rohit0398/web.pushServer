import { Popover, Transition } from '@headlessui/react';
import type { ReactNode } from 'react';
import { Fragment, useState } from 'react';

type IProps = {
  button: ReactNode;
  children: ReactNode;
};
export function TooltipContainer({ children, button }: IProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Popover className="relative inline-block">
      <Popover.Button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {button}
      </Popover.Button>
      <Transition
        show={visible}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute z-10 -mt-3 -translate-y-full rounded bg-stroke-light-gray lg:-mt-5">
          {children}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
