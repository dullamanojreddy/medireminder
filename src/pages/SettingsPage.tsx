import React, { useState } from "react";
import { Calendar, CheckCircle, Edit3, Globe, KeyRound, Mail, Phone, Shield, User } from "lucide-react";

import Button from "../components/Button";
import { useToast } from "../components/Toast";

type AdminMode = "details" | "password" | null;

const isSixDigitOtp = (value: string) => /^\d{6}$/.test(value);

export default function SettingsPage() {
  const { addToast } = useToast();
  const [mode, setMode] = useState<AdminMode>(null);

  const [fullName, setFullName] = useState(localStorage.getItem("caregiverName") || "manojreddy dulla");
  const [dob, setDob] = useState(localStorage.getItem("caregiverDob") || "2004-01-01");
  const [email, setEmail] = useState(localStorage.getItem("caregiverEmail") || "manojreddy@example.com");
  const [phone, setPhone] = useState(localStorage.getItem("caregiverPhone") || "+91 98765 43210");
  const [preferredLanguage, setPreferredLanguage] = useState(
    localStorage.getItem("caregiverPreferredLanguage") || "English"
  );

  const [draftName, setDraftName] = useState(fullName);
  const [draftDob, setDraftDob] = useState(dob);
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftPhone, setDraftPhone] = useState(phone);
  const [draftLanguage, setDraftLanguage] = useState(preferredLanguage);
  const [detailsOtp, setDetailsOtp] = useState("");
  const [showDetailsOtp, setShowDetailsOtp] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordOtp, setPasswordOtp] = useState("");
  const [showPasswordOtp, setShowPasswordOtp] = useState(false);

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "M";

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

  const openDetailsEditor = () => {
    setDraftName(fullName);
    setDraftDob(dob);
    setDraftEmail(email);
    setDraftPhone(phone);
    setDraftLanguage(preferredLanguage);
    setDetailsOtp("");
    setShowDetailsOtp(false);
    setMode("details");
  };

  const openPasswordReset = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordOtp("");
    setShowPasswordOtp(false);
    setMode("password");
  };

  const handleConfirmDetails = () => {
    if (!showDetailsOtp) {
      setShowDetailsOtp(true);
      addToast("OTP sent. Enter any 6 digit number to confirm.", "info");
      return;
    }

    if (!isSixDigitOtp(detailsOtp)) {
      addToast("Enter any 6 digit OTP to confirm details change.", "danger");
      return;
    }

    const nextName = draftName.trim() || fullName;
    const nextEmail = draftEmail.trim();
    const nextPhone = draftPhone.trim();
    const nextLanguage = draftLanguage.trim() || "English";

    setFullName(nextName);
    setDob(draftDob);
    setEmail(nextEmail);
    setPhone(nextPhone);
    setPreferredLanguage(nextLanguage);

    localStorage.setItem("caregiverName", nextName);
    localStorage.setItem("caregiverDob", draftDob);
    localStorage.setItem("caregiverEmail", nextEmail);
    localStorage.setItem("caregiverPhone", nextPhone);
    localStorage.setItem("caregiverPreferredLanguage", nextLanguage);

    setMode(null);
    setShowDetailsOtp(false);
    addToast("Details changed successfully.", "success");
  };

  const handleConfirmPassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      addToast("Fill old password, new password, and confirm password.", "danger");
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast("New password and confirm password must match.", "danger");
      return;
    }

    if (!showPasswordOtp) {
      setShowPasswordOtp(true);
      addToast("OTP sent. Enter any 6 digit number to reset password.", "info");
      return;
    }

    if (!isSixDigitOtp(passwordOtp)) {
      addToast("Enter any 6 digit OTP to confirm password reset.", "danger");
      return;
    }

    localStorage.setItem("caregiverPasswordUpdatedAt", new Date().toISOString());
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordOtp("");
    setMode(null);
    setShowPasswordOtp(false);
    addToast("Password reset successful.", "success");
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      <section className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md border border-blue-500">
              {initials}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Holder</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
                {fullName}
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-1">Admin access enabled</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              id="edit-admin-details-btn"
              variant="primary"
              onClick={openDetailsEditor}
              className="gap-2 h-[42px] text-xs font-extrabold shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Details</span>
            </Button>
            <Button
              id="password-reset-btn"
              variant="outline"
              onClick={openPasswordReset}
              className="gap-2 h-[42px] text-xs font-extrabold border-slate-200"
            >
              <KeyRound className="w-4 h-4" />
              <span>Password Reset</span>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">My Details</h2>
            <p className="text-xs text-slate-500 font-medium">Current saved account information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 pt-5">
          {[
            { label: "Name", value: fullName, icon: User },
            { label: "DOB", value: dob, icon: Calendar },
            { label: "Email", value: email, icon: Mail },
            { label: "Phone No", value: phone, icon: Phone },
            { label: "Preferred Lang", value: preferredLanguage, icon: Globe },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label}</span>
                </div>
                <p className="mt-3 text-sm font-extrabold text-slate-900 break-words">{item.value || "-"}</p>
              </div>
            );
          })}
        </div>
      </section>

      {mode === "details" && (
        <section className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Edit Details</h2>
              <p className="text-xs text-slate-500 font-medium">Press confirm to request OTP, then enter any 6 digit number.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Name
              <input value={draftName} onChange={(event) => setDraftName(event.target.value)} className={inputClass} />
            </label>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              DOB
              <input type="date" value={draftDob} onChange={(event) => setDraftDob(event.target.value)} className={inputClass} />
            </label>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Email
              <input type="email" value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} className={inputClass} />
            </label>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Phone No
              <input value={draftPhone} onChange={(event) => setDraftPhone(event.target.value)} className={inputClass} />
            </label>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Preferred Lang
              <select value={draftLanguage} onChange={(event) => setDraftLanguage(event.target.value)} className={inputClass}>
                <option>English</option>
                <option>Hindi</option>
                <option>Telugu</option>
                <option>Tamil</option>
                <option>Kannada</option>
                <option>Marathi</option>
              </select>
            </label>
            {showDetailsOtp && (
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                OTP
                <input
                  value={detailsOtp}
                  onChange={(event) => setDetailsOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter any 6 digit number"
                  className={inputClass}
                />
              </label>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <Button id="confirm-details-change-btn" variant="success" onClick={handleConfirmDetails} className="gap-2 h-[42px] text-xs font-extrabold">
              <CheckCircle className="w-4 h-4" />
              <span>{showDetailsOtp ? "Confirm OTP" : "Confirm"}</span>
            </Button>
          </div>
        </section>
      )}

      {mode === "password" && (
        <section className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Password Reset</h2>
              <p className="text-xs text-slate-500 font-medium">Press confirm to request OTP, then enter any 6 digit number.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Old Password
              <input type="password" value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} className={inputClass} />
            </label>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              New Password
              <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={inputClass} />
            </label>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Confirm Password
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} />
            </label>
            {showPasswordOtp && (
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                OTP
                <input
                  value={passwordOtp}
                  onChange={(event) => setPasswordOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter any 6 digit number"
                  className={inputClass}
                />
              </label>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <Button id="confirm-password-reset-btn" variant="warning" onClick={handleConfirmPassword} className="gap-2 h-[42px] text-xs font-extrabold">
              <KeyRound className="w-4 h-4" />
              <span>{showPasswordOtp ? "Confirm OTP" : "Confirm Password Reset"}</span>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
