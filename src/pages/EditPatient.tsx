import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { User, Calendar, Phone, ShieldAlert, Heart, ArrowLeft, Save } from "lucide-react";

import { usePatients } from "../context/PatientContext";
import { useToast } from "../components/Toast";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

export default function EditPatient() {
  const { id } = useParams<{ id: string }>();
  const { patients, updatePatient } = usePatients();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
  const [notFound, setNotFound] = useState(false);

  // Fetch and populate details
  useEffect(() => {
    const patient = patients.find((p) => p.id === id);
    if (patient) {
      setForm({
        name: patient.name,
        dob: patient.dob,
        gender: patient.gender,
        phone: patient.phone,
        language: patient.language,
        emergencyContact: patient.emergencyContact || "",
        relationship: patient.relationship || "",
      });
      setNotFound(false);
    } else if (patients.length > 0) {
      setNotFound(true);
    }
  }, [id, patients]);

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
    } else if (!/^\d{10}$/.test(form.phone)) {
      tempErrors.phone = "Phone number must be exactly 10 digits.";
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
    if (!id) return;
    if (!validate()) {
      addToast("Please fill in all details correctly.", "danger");
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePatient(id, {
        name: form.name,
        dob: form.dob,
        gender: form.gender as any,
        phone: form.phone,
        language: form.language as any,
        emergencyContact: form.emergencyContact,
        relationship: form.relationship,
      });
      addToast(`${form.name}'s profile updated successfully.`, "success");
      navigate(`/patients/${id}`); // Navigate back to details page
    } catch (err) {
      addToast("Failed to update patient profile.", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Patient Profile Not Found</h2>
        <p className="text-text-secondary max-w-md">The patient profile you are trying to edit does not exist or has been removed.</p>
        <Link to="/patients">
          <Button id="patient-edit-back-btn" variant="primary">Return to Registry</Button>
        </Link>
      </div>
    );
  }

  const languages = ["Hindi", "English", "Tamil", "Telugu", "Kannada", "Bengali", "Punjabi", "Gujarati"];

  return (
    <div className="flex flex-col gap-6 text-left max-w-2xl mx-auto w-full">
      {/* Back link */}
      <div>
        <Link 
          to={`/patients/${id}`} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Profile</span>
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
          Edit Patient Profile
        </h1>
        <p className="text-sm text-text-secondary font-semibold">
          Modify patient contact points, language, or emergency guardian details.
        </p>
      </div>

      <Card id="edit-patient-form-card" className="border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Section: Basic Demographics */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
              <User className="w-4.5 h-4.5 text-primary" />
              <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">Demographic Profile</h3>
            </div>

            {/* Name */}
            <Input
              id="patient-edit-name"
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
                id="patient-edit-dob"
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
                  id="patient-edit-gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
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
                id="patient-edit-phone"
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
                  id="patient-edit-language"
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
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
              id="patient-edit-emergency-name"
              name="patientEmergencyName"
              label="Contact Guardian Name"
              value={form.emergencyContact}
              onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
              placeholder="e.g. Suman Chandra"
              error={errors.emergencyContact}
            />

            {/* Relationship */}
            <Input
              id="patient-edit-emergency-relationship"
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
            <Link to={`/patients/${id}`}>
              <Button id="patient-edit-cancel-btn" type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button
              id="patient-edit-submit-btn"
              type="submit"
              variant="primary"
              className="gap-2"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}
