import React from 'react';

export function CustomCheckbox({
  label,
  name,
  register,
}: {
  label?: string;
  name: string;
  register: any;
}) {
  return (
    <label className="mt-3 flex items-center">
      <input
        type="checkbox"
        name={name}
        className="form-checkbox h-5 w-5 rounded border-gray text-dark-purple focus:ring-dark-purple"
        {...register(name)}
      />
      <span className="ml-2 text-gray">{label}</span>
    </label>
  );
}
