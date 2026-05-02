import type { ChangeEvent } from "react";

type FormInputBase = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

type FormInputAsInput = FormInputBase & {
  multiline?: false;
  type?: "text" | "date" | "number" | "tel";
  rows?: never;
  min?: number;
  max?: number;
  autoComplete?: string;
};

type FormInputAsTextarea = FormInputBase & {
  multiline: true;
  type?: never;
  rows?: number;
};

export type FormInputProps = FormInputAsInput | FormInputAsTextarea;

const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-400";

export function FormInput(props: FormInputProps) {
  const {
    id,
    name,
    label,
    value,
    onChange,
    error,
    required,
    placeholder,
    className = "",
  } = props;
  const autoComplete =
    props.multiline ? undefined : (props as FormInputAsInput).autoComplete;

  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      {props.multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={props.rows ?? 4}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${fieldClass} min-h-[100px] resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={props.type ?? "text"}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          min={props.multiline ? undefined : props.min}
          max={props.multiline ? undefined : props.max}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={fieldClass}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
