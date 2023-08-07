import React from 'react';

interface RadioInputProps {
  label: string;
  value: string;
  name: string;
  register: any;
  checked?: boolean;
}

export const RadioInput: React.FC<RadioInputProps> = ({
  label,
  value,
  name,
  register,
  checked,
}) => {
  return (
    <div
      className={`flex min-h-[2.375rem] items-center justify-center rounded border px-3 ${
        checked
          ? 'border-2 border-dark-purple text-dark-purple'
          : 'border-light-gray'
      }`}
    >
      <input
        type="radio"
        id={value}
        name={name}
        value={value}
        className="hidden"
        {...register(name)}
      />
      <label htmlFor={value} className=" cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
};
