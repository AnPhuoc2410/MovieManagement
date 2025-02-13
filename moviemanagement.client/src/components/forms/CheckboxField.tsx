import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Checkbox, FormControlLabel } from "@mui/material";

interface CheckboxFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  errors?: FieldErrors;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  control,
  errors,
}) => (
  <div className="flex items-center">
    <label htmlFor={name} className="ml-6 block text-sm text-gray-900">
      {label}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <Checkbox
          {...field}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          color="primary"
        />
      )}
    />

    {errors && errors[name] && (
      <p className="mt-1 text-xs text-red-500">
        {errors[name]?.message as string}
      </p>
    )}
  </div>
);

export default CheckboxField;
