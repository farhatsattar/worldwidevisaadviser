import type { ChangeEvent, ReactNode } from "react";
import { FormInput, FormSection, FormSelect } from "@/components/form";
import type { RegistrationApplicationValues } from "@/lib/registration-application-fields";
import { VISA_DESTINATION_COUNTRY_OPTIONS } from "@/lib/visa-destination-countries";

type ChangeHandler = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) => void;

type Props = {
  values: RegistrationApplicationValues;
  errors: Record<string, string>;
  onChange: ChangeHandler;
  /** Render before Personal Information (e.g. optional referral input). */
  beforePersonal?: ReactNode;
};

export function RegistrationApplicationFields({
  values,
  errors,
  onChange,
  beforePersonal,
}: Props) {
  return (
    <>
      <FormSection title="Personal Information">
        {beforePersonal ? (
          <div className="mb-4 space-y-4">{beforePersonal}</div>
        ) : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            id="nameFatherName"
            name="nameFatherName"
            label="Name / Father Name"
            value={values.nameFatherName}
            onChange={onChange}
            error={errors.nameFatherName}
            required
            placeholder="Full name and father's name"
          />
          <FormInput
            id="dateOfBirth"
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={values.dateOfBirth}
            onChange={onChange}
            error={errors.dateOfBirth}
            required
          />
          <FormInput
            id="placeOfBirth"
            name="placeOfBirth"
            label="Place of Birth"
            value={values.placeOfBirth}
            onChange={onChange}
            error={errors.placeOfBirth}
            required
          />
          <FormInput
            id="nationality"
            name="nationality"
            label="Nationality"
            value={values.nationality}
            onChange={onChange}
            error={errors.nationality}
            required
          />
          <FormInput
            id="fullAddress"
            name="fullAddress"
            label="Full Address"
            value={values.fullAddress}
            onChange={onChange}
            error={errors.fullAddress}
            required
            multiline
            rows={4}
            className="md:col-span-2"
            placeholder="Street, area, postal code"
          />
          <FormInput
            id="cityCountry"
            name="cityCountry"
            label="City / Country"
            value={values.cityCountry}
            onChange={onChange}
            error={errors.cityCountry}
            required
          />
          <FormSelect
            id="gender"
            name="gender"
            label="Gender"
            value={values.gender}
            onChange={onChange}
            error={errors.gender}
            required
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
          />
          <FormInput
            id="whatsAppNumber"
            name="whatsAppNumber"
            label="WhatsApp Number"
            type="tel"
            value={values.whatsAppNumber}
            onChange={onChange}
            error={errors.whatsAppNumber}
            required
            placeholder="+92 …"
          />
          <FormInput
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            value={values.phoneNumber}
            onChange={onChange}
            error={errors.phoneNumber}
            required
          />
          <FormSelect
            id="maritalStatus"
            name="maritalStatus"
            label="Marital Status"
            value={values.maritalStatus}
            onChange={onChange}
            error={errors.maritalStatus}
            required
            options={[
              { value: "single", label: "Single" },
              { value: "married", label: "Married" },
            ]}
          />
          <FormInput
            id="numberOfChildren"
            name="numberOfChildren"
            label="Number of Children"
            type="number"
            value={values.numberOfChildren}
            onChange={onChange}
            error={errors.numberOfChildren}
            required
            placeholder="0"
            min={0}
          />
        </div>
      </FormSection>

      <FormSection title="Current Profile Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            id="education"
            name="education"
            label="Education"
            value={values.education}
            onChange={onChange}
            error={errors.education}
            required
          />
          <FormInput
            id="profession"
            name="profession"
            label="Profession"
            value={values.profession}
            onChange={onChange}
            error={errors.profession}
            required
          />
          <FormSelect
            id="visaDestinationCountry"
            name="visaDestinationCountry"
            label="Country where you want a visa"
            value={values.visaDestinationCountry}
            onChange={onChange}
            error={errors.visaDestinationCountry}
            required
            options={VISA_DESTINATION_COUNTRY_OPTIONS}
            placeholder="Select country"
            className="md:col-span-2"
          />
          <FormInput
            id="visaType"
            name="visaType"
            label="Visa type / category applying for"
            value={values.visaType}
            onChange={onChange}
            error={errors.visaType}
            required
            placeholder="e.g. Study, Work, Visit, Family"
          />
          <FormInput
            id="ownerEmployer"
            name="ownerEmployer"
            label="Owner / Employer"
            value={values.ownerEmployer}
            onChange={onChange}
            error={errors.ownerEmployer}
            required
          />
          <FormInput
            id="experience"
            name="experience"
            label="Experience"
            value={values.experience}
            onChange={onChange}
            error={errors.experience}
            required
            placeholder="Years / summary"
            className="md:col-span-2"
          />
        </div>
      </FormSection>

      <FormSection title="Travel History and Visa Refusal">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            id="travelCountryName"
            name="travelCountryName"
            label="Travel Country Name"
            value={values.travelCountryName}
            onChange={onChange}
            placeholder="Optional"
          />
          <FormInput
            id="refusalCountryName"
            name="refusalCountryName"
            label="Refusal Country Name"
            value={values.refusalCountryName}
            onChange={onChange}
            placeholder="Optional"
          />
          <FormInput
            id="visaNotUsedCountryName"
            name="visaNotUsedCountryName"
            label="Visa Not Used Country Name"
            value={values.visaNotUsedCountryName}
            onChange={onChange}
            className="md:col-span-2"
            placeholder="Optional"
          />
        </div>
      </FormSection>
    </>
  );
}
