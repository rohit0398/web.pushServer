import React from "react";
import { UseFormReturn, UseFormRegister, DeepPartial } from "react-hook-form";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface CustomInputProps<T extends Record<string, any>> extends InputProps {
  label?: string;
  name: any 
  register: UseFormRegister<T>;
  formState: any;
  validate?: any
  rules?: any
}

export const InputField = <T extends Record<string, any>>({
  label,
  name,
  register,
  formState,
  rules={},
  validate={},
  ...rest
}: CustomInputProps<T>) => {
  const error: any = formState?.errors[name] as any
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="block text-gray mb-1 text-left">
          {label}
        </label>
      )}
      <input
        {...register(name,{...rules, validate})}
        {...rest}
        className={`px-1.5 py-1 block w-full min-h-[2.375rem] rounded border shadow-sm focus:border-gray ${
          error ? "border-red-500" : "border-light-gray"
        }`}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
