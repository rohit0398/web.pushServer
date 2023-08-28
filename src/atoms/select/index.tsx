import React from 'react';
import type { Props as SelectProps } from 'react-select';
import Select from 'react-select';

interface SelectSearchProps<Option> {
  options: SelectProps<Option>['options'];
  name: string;
  label?: string;
  error?: string;
  placeholder?: string;
  value?: SelectProps<Option>['options'];
  onChange?: (data: any) => void;
}
export const SelectSearch = <Option extends { label: string; value: string }>({
  options,
  name,
  label,
  error,
  placeholder,
  value,
  onChange,
}: SelectSearchProps<Option>) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className=" mb-2 font-medium text-medium-gray">
          {label}
        </label>
      )}

      <Select
        options={options}
        value={value}
        inputId={name}
        instanceId={name}
        placeholder={placeholder}
        onChange={onChange}
        className={`rounded-md shadow-sm focus:ring ${
          error ? 'border-red-500' : 'border-light-gray'
        }`}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
