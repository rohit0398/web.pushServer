import React, { useEffect, useState } from "react";
import Select, { OptionsType, ValueType } from "react-select";
import {
  DeepMap,
  FieldError,
  FieldValues,
} from "react-hook-form";

interface MultiSelectSearchProps<T> {
  options: OptionsType<T>;
  name: string;
  label: string;
  register: any;
  error: DeepMap<FieldValues, FieldError>;
}

const MultiSelectSearch = <T extends { label: string; value: string }>({
  options,
  name,
  label,
  register,
  error,
}: MultiSelectSearchProps<T>) => {
  const [selectedOptions, setSelectedOptions] = useState<ValueType<T>>([]);

  useEffect(() => {
    register(name);
  }, [register, name]);
  const handleChange = (selected: ValueType<T>) => {
    setSelectedOptions(selected);
    console.log(
      "register",
      register(name).onChange({
        target: {
          name: name,
          value: selected,
        },
      }),
      selected
    );
    // register(name)?.onChange(selected);
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="form-label text-medium-gray font-medium mb-2">
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
        className={`rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
          error?.[name] ? "border-red-500" : "border-light-gray"
        }`}
      />
      {error?.[name] && (
        <p className="text-red-500">{error?.[name]?.message}</p>
      )}
    </div>
  );
};

export default MultiSelectSearch;
