import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FancyFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  control: Control<T>;
  errors: any;
}

const FancyFormField = <T extends FieldValues>({
  name,
  label,
  type = "text",
  control,
  errors,
}: FancyFormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="[--clr:#1f1f1f] dark:[--clr:#999999] relative flex flex-row items-center mb-4">
          <input
            {...field}
            type={type}
            id={name}
            required
            placeholder=""
            spellCheck="false"
            autoComplete="off"
            className="peer text-black dark:text-white pl-2 h-[40px] min-h-[40px] pr-[40px] leading-normal appearance-none resize-none box-border text-base w-full text-inherit block text-left border border-solid bg-white dark:bg-zinc-800 rounded-[10px] m-0 p-0 outline-0 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#71717a2e] dark:focus-visible:ring-[#14b8a61a]"
          />
          <label
            htmlFor={name.toString()}
            className="cursor-text text-[--clr] inline-block z-0 text-sm mb-px font-normal text-start select-none absolute duration-300 transform origin-[0] translate-x-[32px] peer-focus-visible:text-teal-500 peer-focus-visible:translate-x-[8px] peer-[:not(:placeholder-shown)]:translate-x-[8px] peer-focus-visible:translate-y-[-36px] peer-[:not(:placeholder-shown)]:translate-y-[-36px]"
          >
            {label}
          </label>
          <div className="group w-[40px] absolute top-0 bottom-0 right-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1rem"
              height="1rem"
              strokeLinejoin="round"
              strokeLinecap="round"
              viewBox="0 0 24 24"
              strokeWidth="2"
              fill="none"
              className={`transition-colors duration-200 ${
                errors[name]
                  ? "stroke-red-500"
                  : "stroke-[--clr] peer-focus-visible:stroke-teal-600"
              }`}
            >
              <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
            {errors[name] && (
              <span className="text-sm absolute cursor-default select-none rounded-[4px] px-1.5 opacity-0 whitespace-nowrap left-1/2 -translate-x-1/2 text-red-500 -top-8 group-hover:opacity-100 transition-opacity duration-200 bg-white shadow-md border border-gray-200">
                {errors[name].message}
              </span>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default FancyFormField;
