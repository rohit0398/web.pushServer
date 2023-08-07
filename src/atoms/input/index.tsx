import React from 'react';
import type { UseFormRegister } from 'react-hook-form';

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface CustomInputProps<T extends Record<string, any>> extends InputProps {
  label?: string;
  name: any;
  register: UseFormRegister<T>;
  formState: any;
  validate?: any;
  rules?: any;
}

export const InputField = <T extends Record<string, any>>({
  label,
  name,
  register,
  formState,
  rules = {},
  validate = {},
  ...rest
}: CustomInputProps<T>) => {
  const error: any = formState?.errors[name] as any;
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-1 block text-left text-gray">
          {label}
        </label>
      )}
      <input
        {...register(name, { ...rules, validate })}
        {...rest}
        className={`block min-h-[2.375rem] w-full rounded border px-1.5 py-1 shadow-sm focus:border-gray ${
          error ? 'border-red-500' : 'border-light-gray'
        }`}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
