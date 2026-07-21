import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Calendar, Phone, Lock, Eye, EyeOff, Mail } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import LanguageDropdown from "../components/LanguageDropdown";
import { Language } from "../types";
import { useToast } from "../components/Toast";
import { authService } from "../services/authService";
import { usePatients } from "../context/PatientContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { refreshPatients } = usePatients();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    dob: "",
    phoneNumber: "",
    preferredLanguage: "English" as Language,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setForm((prev) => ({ ...prev, preferredLanguage: lang }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (form.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!form.dob) {
      newErrors.dob = "Date of birth is required.";
    } else {
      const birthDate = new Date(form.dob);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.dob = "Date of birth must be in the past.";
      }
    }

    // Direct phone number matching
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!form.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!phoneRegex.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number (starts with 6-9).";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast("Please fix the validation errors before registering.", "danger");
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        name: form.fullName,
        email: form.email,
        phone: form.phoneNumber,
        password: form.password,
      });

      await refreshPatients();
      addToast("Account registered successfully! Welcome.", "success");
      navigate("/dashboard");
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Registration failed. Please try again.";
      addToast(errMsg, "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-6 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-lg">
        <Card id="register-card" className="w-full">
          {/* Header */}
          <div className="text-center flex flex-col gap-2 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
              Create an Account
            </h1>
            <p className="text-[15px] text-text-secondary leading-normal">
              Register to receive personalized medicine reminders.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="register-input-fullname"
              name="fullName"
              label="Full Name"
              placeholder="e.g. Rahul Sharma"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
              icon={<User className="w-5 h-5" />}
            />

            <Input
              id="register-input-email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="e.g. rahul@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
              icon={<Mail className="w-5 h-5" />}
            />

            <Input
              id="register-input-dob"
              name="dob"
              type="date"
              label="Date of Birth"
              value={form.dob}
              onChange={handleChange}
              error={errors.dob}
              required
              icon={<Calendar className="w-5 h-5" />}
            />

            <Input
              id="register-input-phone"
              name="phoneNumber"
              type="tel"
              label="Phone Number"
              placeholder="e.g. 9876543210"
              value={form.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              required
              maxLength={10}
              icon={<Phone className="w-5 h-5" />}
            />

            <LanguageDropdown
              id="register-input-language"
              selected={form.preferredLanguage}
              onChange={handleLanguageChange}
              required
              error={errors.preferredLanguage}
            />

            <div className="relative">
              <Input
                id="register-input-password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                required
                icon={<Lock className="w-5 h-5" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[44px] text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                id="register-input-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                icon={<Lock className="w-5 h-5" />}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-[44px] text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="mt-4">
              <Button
                id="register-submit-btn"
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
            </div>
          </form>

          {/* Bottom redirection Link */}
          <div className="text-center mt-6 pt-5 border-t border-brand-border">
            <p className="text-sm text-text-secondary font-medium">
              Already have an account?{" "}
              <Link
                id="register-login-redirect"
                to="/login"
                className="text-primary hover:text-primary-hover font-bold focus:outline-none focus:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
