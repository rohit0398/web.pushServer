import React from "react";

export function CustomCheckbox({ label, name, register }:{label?: string, name: string, register: any}) {
  return (
    <label className="flex items-center mt-3">
      <input
        type="checkbox"
        name={name}
        className="h-5 w-5 form-checkbox text-dark-purple focus:ring-dark-purple border-gray rounded"
        {...register(name)} 
      />
      <span className="ml-2 text-gray">{label}</span>
    </label>
  );
}
