import React, { useEffect, useState } from 'react';
import type { Props as SelectProps } from 'react-select';
import Select from 'react-select';

interface MultiSelectSearchProps<Option> {
  options: SelectProps<Option>['options'];
  name: string;
  label: string;
  register: any;
  error: any;
}
const MultiSelectSearch = <Option extends { label: string; value: string }>({
  options,
  name,
  label,
  register,
  error,
}: MultiSelectSearchProps<Option>) => {
  const [selectedOptions, setSelectedOptions] = useState<
    SelectProps<Option>['value']
  >([]);

  useEffect(() => {
    register(name);
  }, [register, name]);
  const handleChange = (selected: SelectProps<Option>['value']) => {
    setSelectedOptions(selected);
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className=" mb-2 font-medium text-medium-gray">
        {label}
      </label>
      <Select
        options={options}
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        name={name}
        inputId={name}
        instanceId={name}
        className={`rounded-md shadow-sm focus:ring ${
          error?.[name] ? 'border-red-500' : 'border-light-gray'
        }`}
      />
      {error?.[name] && (
        <p className="text-red-500">{error?.[name]?.message}</p>
      )}
    </div>
  );
};

export default MultiSelectSearch;
