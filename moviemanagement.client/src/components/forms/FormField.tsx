import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  control: Control<any>;
  errors: FieldErrors;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  control,
  errors,
}) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-2 text-lg text-gray-700">
      {label} *
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          id={name}
          className="input border-indigo mt-1 rounded-lg border-2 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Enter your ${label}`}
        />
      )}
    />
    {errors[name] && (
      <p className="error text-red-500 mt-1">
        {errors[name]?.message as string}
      </p>
    )}
  </div>
);

export default FormField;
