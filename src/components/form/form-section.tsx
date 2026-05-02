import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function FormSection({
  title,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      <h2 className="border-b border-gray-200 pb-2 text-lg font-bold text-gray-900">
        {title}
      </h2>
      {children}
    </section>
  );
}
