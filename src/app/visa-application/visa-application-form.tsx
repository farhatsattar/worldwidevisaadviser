"use client";

import { type ChangeEvent, type FormEvent, useCallback, useState } from "react";
import { FormInput } from "@/components/form";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { RegistrationApplicationFields } from "@/components/form/registration-application-fields";
import {
  initialRegistrationApplicationValues,
  validateRegistrationApplication,
  type RegistrationApplicationValues,
} from "@/lib/registration-application-fields";

type VisaFormState = RegistrationApplicationValues & {
  referralCode: string;
};

const initialValues: VisaFormState = {
  ...initialRegistrationApplicationValues,
  referralCode: "",
};

export function VisaApplicationForm() {
  const [values, setValues] = useState<VisaFormState>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
      setSubmitStatus("idle");
    },
    [],
  );

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const { referralCode: _r, ...application } = values;
    const nextErrors = validateRegistrationApplication(application);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitStatus("error");
      return;
    }
    setSubmitStatus("success");
    console.log("Visa application payload:", {
      ...application,
      referralCode: values.referralCode.trim() || undefined,
    });
  }

  const applicationSlice = values;
  const applicationErrors = errors;

  return (
    <div className="min-h-screen wva-page-bg font-[family-name:var(--font-inter)]">
      <Navbar
        items={[
          { label: "Home", href: "/" },
          {
            label: "Leaderboard",
            href: "/#leaders",
            icon: "leaderboard",
          },
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: "dashboard",
          },
          { label: "Log in", href: "/login" },
        ]}
        signup={{ label: "Sign up", href: "/signup" }}
      />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Visa Application System
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please complete all required fields (*). Referral code is optional.
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
          {submitStatus === "success" ? (
            <div
              className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
              role="status"
            >
              Validation passed. Demo mode: payload is logged to the console;
              wire this to your API when ready.
            </div>
          ) : null}

          {submitStatus === "error" && Object.keys(errors).length > 0 ? (
            <div
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
              role="alert"
            >
              Some fields are missing or invalid — see messages below.
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-10" noValidate>
            <RegistrationApplicationFields
              values={applicationSlice}
              errors={applicationErrors}
              onChange={handleChange}
              beforePersonal={
                <FormInput
                  id="referralCode"
                  name="referralCode"
                  label="Referral Code (optional)"
                  value={values.referralCode}
                  onChange={handleChange}
                  placeholder="If someone referred you"
                  className="md:max-w-md"
                />
              }
            />

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                onClick={() => {
                  setValues(initialValues);
                  setErrors({});
                  setSubmitStatus("idle");
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
              >
                Submit application
              </button>
            </div>
          </form>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
