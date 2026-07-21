import React from "react";
import { User, Calendar, Phone, Globe, ShieldAlert, Heart, Clock, BadgeCheck } from "lucide-react";
import Card from "../Card";
import Badge from "../common/Badge";
import { Patient } from "../../mock/mockPatients";

interface PatientInfoProps {
  patient: Patient;
}

export default function PatientInfo({ patient }: PatientInfoProps) {
  const emergencyInitial = (patient.emergencyContact || "E").charAt(0).toUpperCase();

  const calculateAge = (dobString: string) => {
    if (!dobString) return "N/A";
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return "N/A";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) return dateString;
    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-left w-full items-stretch">
      {/* 1. Patient Demographics Card */}
      <Card id="patient-demographics-card" className="border-gray-100/80 shadow-sm p-6 bg-white flex flex-col gap-5 h-full">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-text-primary tracking-tight">
              Patient Demographics
            </h4>
            <p className="text-xs text-text-secondary font-medium">
              Registered profile and contact parameters
            </p>
          </div>
        </div>

        {/* Two-column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4.5 gap-x-6 text-sm">
          {/* Full Name */}
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">
              Full Name
            </span>
            <div className="flex items-center gap-2 font-bold text-text-primary min-w-0">
              <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">{patient.name}</span>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">
              Date of Birth
            </span>
            <div className="flex items-center gap-2 font-semibold text-text-primary min-w-0">
              <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">{formatDate(patient.dob)}</span>
            </div>
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">
              Age
            </span>
            <div className="flex items-center gap-2 font-semibold text-text-primary min-w-0">
              <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>{calculateAge(patient.dob)} Years</span>
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">
              Gender
            </span>
            <div className="flex items-center gap-2 font-semibold text-text-primary min-w-0">
              <Heart className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{patient.gender}</span>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">
              Phone Number
            </span>
            <div className="flex items-center gap-2 font-semibold text-text-primary min-w-0">
              <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="truncate">+91 {patient.phone}</span>
            </div>
          </div>

          {/* Language */}
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">
              Language
            </span>
            <div className="flex items-center gap-2 font-semibold text-text-primary min-w-0">
              <Globe className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <Badge type="primary">{patient.language}</Badge>
            </div>
          </div>

          {/* Registered Date */}
          <div className="flex flex-col gap-1 sm:col-span-2 min-w-0 pt-1 border-t border-gray-50">
            <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">
              Registered Date
            </span>
            <div className="flex items-center gap-2 font-semibold text-text-primary min-w-0">
              <Calendar className="w-4 h-4 text-text-secondary flex-shrink-0" />
              <span>{formatDate(patient.createdAt)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card id="emergency-contact-card" className="border-rose-100 bg-white p-5 flex flex-col gap-5 text-left shadow-sm overflow-hidden relative h-full">
        <div className="absolute inset-x-0 top-0 h-1 bg-rose-500" />

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h5 className="font-extrabold text-sm text-slate-950 tracking-tight">
              Emergency Contact
            </h5>
            <p className="text-xs text-slate-500 font-medium">
              Primary person to reach during urgent care events
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white text-rose-600 border border-rose-100 flex items-center justify-center text-lg font-extrabold shrink-0">
            {emergencyInitial}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-rose-500 uppercase font-extrabold tracking-wider">
              Contact Name
            </span>
            <p className="text-base text-slate-950 font-extrabold truncate">
              {patient.emergencyContact || "Not Provided"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 min-w-0">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>Phone Number</span>
            </div>
            <p className="mt-2 text-base text-slate-900 font-extrabold whitespace-nowrap tracking-wide">
              {patient.phone ? `+91 ${patient.phone}` : "Not Provided"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 min-w-0">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
              <BadgeCheck className="w-4 h-4 text-blue-500" />
              <span>Relationship</span>
            </div>
            <p className="mt-2 inline-flex max-w-full rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-sm text-blue-700 font-extrabold break-words">
              {patient.relationship || "Not Provided"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
