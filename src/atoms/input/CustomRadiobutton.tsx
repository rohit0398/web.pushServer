import React from "react";
interface RadioInputProps {
  label: string;
  value: string;
  name: string;
  register: any;
  checked?: boolean
}

export const RadioInput: React.FC<RadioInputProps> = ({
  label,
  value,
  name,
  register,
  checked
}) => {
  return (
    <div
      className={`flex items-center justify-center border px-3 rounded min-h-[2.375rem] ${
        checked ? "border-dark-purple border-2 text-dark-purple" : "border-light-gray"
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
      <label
        htmlFor={value}
        className="btn btn-default cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );
};
