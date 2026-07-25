import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Calendar, Phone, ShieldAlert, Heart, ArrowLeft, UserPlus } from "lucide-react";

import { usePatients } from "../context/PatientContext";
import { useToast } from "../components/Toast";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { Patient } from "../mock/mockPatients";

// Phone normalization function (mirrors backend logic)
const normalizePhone = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return '';
  
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');
  
  if (digitsOnly.length === 0) return '';
  
  if (hasPlus) {
    return '+' + digitsOnly;
  }
  
  let number = digitsOnly;
  if (number.startsWith('0')) {
    number = number.substring(1);
  }
  
  if (number.length === 10) {
    return '+91' + number;
  }
  
  if (number.length === 12 && number.startsWith('91')) {
    return '+' + number;
  }
  
  return '+' + number;
};

export default function AddPatient() {
  const { addPatient } = usePatients();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<Omit<Patient, "id" | "createdAt" | "medicines">>({
    name: "",
    dob: "",
    gender: "Female",
    phone: "",
    language: "Hindi",
    emergencyContact: "",
    relationship: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!form.name.trim()) tempErrors.name = "Patient full name is required.";
    if (!form.dob) tempErrors.dob = "Date of birth is required.";
    
    // Check future date
    if (form.dob && new Date(form.dob) > new Date()) {
      tempErrors.dob = "Date of birth cannot be in the future.";
    }

    if (!form.phone) {
      tempErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(form.phone) && !/^\+[1-9]\d{6,14}$/.test(form.phone)) {
      tempErrors.phone = "Phone number must be 10 digits or valid E.164 format (e.g., +919966007804).";
    }

    if (!form.emergencyContact.trim()) {
      tempErrors.emergencyContact = "Emergency contact name is required.";
    }

    if (!form.relationship.trim()) {
      tempErrors.relationship = "Relationship to patient is required.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast("Please fill in all details correctly.", "danger");
      return;
    }

    setIsSubmitting(true);
    try {
      // Normalize phone number before sending to backend
      const normalizedPhone = normalizePhone(form.phone);
      
      const created = await addPatient({
        name: form.name,
        dob: form.dob,
        gender: form.gender,
        phone: normalizedPhone,
        language: form.language,
        emergencyContact: form.emergencyContact,
        relationship: form.relationship,
        medicines: [],
      });
      addToast(`${created.name} registered successfully.`, "success");
      navigate(`/patients/${created.id}`); // Land directly on patient details page to add medicines
    } catch (err: any) {
      if (err.response?.status === 401) {
        addToast("Session expired. Please log in again.", "danger");
        // Clear invalid token and redirect to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("caregiverName");
        localStorage.removeItem("caregiverEmail");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.message || "Validation error";
        addToast(`Error: ${errorMsg}`, "danger");
      } else {
        addToast("Failed to register patient profile. Please try again.", "danger");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages = ["Hindi", "English", "Tamil", "Telugu", "Kannada", "Bengali", "Punjabi", "Gujarati"];

  return (
    <div className="flex flex-col gap-6 text-left max-w-2xl mx-auto w-full">
      {/* Back link */}
      <div>
        <Link 
          to="/patients" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patients Registry</span>
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
          Register New Patient
        </h1>
        <p className="text-sm text-text-secondary font-semibold">
          Create a central profile with emergency contacts and language settings.
        </p>
      </div>

      <Card id="add-patient-form-card" className="border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Section: Basic Demographics */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
              <User className="w-4.5 h-4.5 text-primary" />
              <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">Demographic Profile</h3>
            </div>

            {/* Name */}
            <Input
              id="patient-name"
              name="patientName"
              label="Patient Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ramesh Chandra"
              error={errors.name}
            />

            {/* Grid DOB & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="patient-dob"
                name="patientDob"
                label="Date of Birth"
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                error={errors.dob}
              />

              <div className="flex flex-col gap-2 text-left">
                <label className="text-[14px] font-bold text-text-primary">
                  Gender
                </label>
                <select
                  id="patient-gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as "Female" | "Male" | "Other" })}
                  className="w-full h-[48px] px-4 bg-white border border-brand-border rounded-input text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Grid Phone & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="patient-phone"
                name="patientPhone"
                label="Primary Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit mobile number"
                error={errors.phone}
              />

              <div className="flex flex-col gap-2 text-left">
                <label className="text-[14px] font-bold text-text-primary">
                  Preferred Language
                </label>
                <select
                  id="patient-language"
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value as "English" | "Hindi" | "Telugu" | "Tamil" | "Kannada" | "Marathi" | "Bengali" | "Punjabi" | "Gujarati" })}
                  className="w-full h-[48px] px-4 bg-white border border-brand-border rounded-input text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Emergency Contacts */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
              <ShieldAlert className="w-4.5 h-4.5 text-danger" />
              <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">Emergency Guardian Contacts</h3>
            </div>

            {/* Contact Person Name */}
            <Input
              id="patient-emergency-name"
              name="patientEmergencyName"
              label="Contact Guardian Name"
              value={form.emergencyContact}
              onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
              placeholder="e.g. Suman Chandra"
              error={errors.emergencyContact}
            />

            {/* Relationship */}
            <Input
              id="patient-emergency-relationship"
              name="patientEmergencyRelationship"
              label="Relationship to Patient"
              value={form.relationship}
              onChange={(e) => setForm({ ...form, relationship: e.target.value })}
              placeholder="e.g. Daughter, Son, Husband"
              error={errors.relationship}
            />
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 mt-4 border-t border-brand-border pt-6">
            <Link to="/patients">
              <Button id="patient-add-cancel-btn" type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button
              id="patient-add-submit-btn"
              type="submit"
              variant="primary"
              className="gap-2"
              disabled={isSubmitting}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Profile</span>
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}
