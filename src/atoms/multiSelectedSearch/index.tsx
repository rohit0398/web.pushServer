import React from 'react';
import { Controller } from 'react-hook-form';
import type { Props as SelectProps } from 'react-select';
import Select from 'react-select';

interface MultiSelectSearchProps<Option> {
  options: SelectProps<Option>['options'];
  name: string;
  label?: string;
  control: any;
  error: any;
  placeholder?: string;
}
const MultiSelectSearch = <Option extends { label: string; value: string }>({
  options,
  name,
  label,
  control,
  error,
  placeholder,
}: MultiSelectSearchProps<Option>) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className=" mb-2 font-medium text-medium-gray">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            options={options}
            isMulti
            inputId={name}
            instanceId={name}
            placeholder={placeholder}
            className={`rounded-md shadow-sm focus:ring ${
              error?.[name] ? 'border-red-500' : 'border-light-gray'
            }`}
            {...field}
          />
        )}
      />

      {error?.[name] && (
        <p className="text-red-500">{error?.[name]?.message}</p>
      )}
    </div>
  );
};

export default MultiSelectSearch;
