import { Listbox, Transition } from '@headlessui/react';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

export type ISelectOption = { name: string; value: string };

type IProps = {
  data: ISelectOption[];
  value?: ISelectOption;
  onChange: (val: ISelectOption) => void;
  asPlaceHolder?: boolean;
};
export function Select({ data, value, onChange, asPlaceHolder }: IProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      <Listbox.Button
        className={`relative w-full cursor-default rounded-[.375rem] bg-white py-[.875rem] pl-4 pr-10 text-left text-xs font-bold ${
          asPlaceHolder ? 'text-light-gray' : 'text-medium-gray'
        } cursor-pointer border border-light-gray`}
      >
        <span className="block truncate">{value?.name}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <ArrowDownIcon aria-hidden="true" className="h-4 w-4" />
        </span>
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute z-10 max-h-60 w-full overflow-auto rounded-md border border-t-0 border-light-gray bg-white px-4 py-1 text-xs font-bold shadow-lg">
          {data.map((option) => (
            /* Use the `active` state to conditionally style the active option. */
            /* Use the `selected` state to conditionally style the selected option. */
            <Listbox.Option key={option.value} value={option} as={Fragment}>
              {({ active, selected }) => (
                <li
                  className={`${
                    active || selected ? 'text-medium-gray' : 'text-light-gray'
                  } my-1 cursor-pointer`}
                >
                  {/* {selected && <CheckIcon />} */}
                  {option.name}
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}
