import type { Metadata } from "next";
import { VisaApplicationForm } from "./visa-application-form";

export const metadata: Metadata = {
  title: "Visa Application | Worldwide Visa Adviser",
  description:
    "Multi-section visa application form — personal details, profile, and travel history.",
};

export default function VisaApplicationPage() {
  return <VisaApplicationForm />;
}
