/** Shared fields for full visa-style registration / application forms */

export type RegistrationApplicationValues = {
  nameFatherName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  fullAddress: string;
  cityCountry: string;
  gender: string;
  whatsAppNumber: string;
  phoneNumber: string;
  maritalStatus: string;
  numberOfChildren: string;
  education: string;
  profession: string;
  ownerEmployer: string;
  experience: string;
  visaDestinationCountry: string;
  visaType: string;
  travelCountryName: string;
  refusalCountryName: string;
  visaNotUsedCountryName: string;
};

export const initialRegistrationApplicationValues: RegistrationApplicationValues =
  {
    nameFatherName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    nationality: "",
    fullAddress: "",
    cityCountry: "",
    gender: "",
    whatsAppNumber: "",
    phoneNumber: "",
    maritalStatus: "",
    numberOfChildren: "",
    education: "",
    profession: "",
    ownerEmployer: "",
    experience: "",
    visaDestinationCountry: "",
    visaType: "",
    travelCountryName: "",
    refusalCountryName: "",
    visaNotUsedCountryName: "",
  };

export function validateRegistrationApplication(
  values: RegistrationApplicationValues,
): Record<string, string> {
  const e: Record<string, string> = {};
  const req = (key: keyof RegistrationApplicationValues, label: string) => {
    const v = values[key]?.trim();
    if (!v) e[key as string] = `${label} is required.`;
  };

  req("nameFatherName", "Name / Father name");
  req("dateOfBirth", "Date of birth");
  req("placeOfBirth", "Place of birth");
  req("nationality", "Nationality");
  req("fullAddress", "Full address");
  req("cityCountry", "City / Country");
  req("gender", "Gender");
  req("whatsAppNumber", "WhatsApp number");
  req("phoneNumber", "Phone number");
  req("maritalStatus", "Marital status");

  const childrenRaw = values.numberOfChildren.trim();
  if (childrenRaw === "") {
    e.numberOfChildren = "Number of children is required (0 is allowed).";
  } else {
    const n = Number(childrenRaw);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
      e.numberOfChildren = "Enter a valid whole number (0 or greater).";
    }
  }

  req("education", "Education");
  req("profession", "Profession");
  req("ownerEmployer", "Owner / Employer");
  req("experience", "Experience");
  req("visaDestinationCountry", "Visa destination country");
  req("visaType", "Visa type");

  return e;
}
