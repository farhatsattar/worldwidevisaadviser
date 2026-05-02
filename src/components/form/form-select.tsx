import type { ChangeEvent } from "react";

export type SelectOption = { value: string; label: string };

type FormSelectProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

const selectClass =
  "w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 outline-none transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-400";

export function FormSelect({
  id,
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  error,
  required,
  className = "",
}: FormSelectProps) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={selectClass}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
