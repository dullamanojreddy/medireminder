import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, KeyRound, Check } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { useToast } from "../components/Toast";
import { authService } from "../services/authService";
import { usePatients } from "../context/PatientContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { refreshPatients } = usePatients();

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmailOrPhone, setForgotEmailOrPhone] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isForgotSubmitted, setIsForgotSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) {
      newErrors.email = "Email address is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast("Please fill in all details correctly.", "danger");
      return;
    }

    setIsLoading(true);

    try {
      await authService.login({
        email: form.email,
        password: form.password,
      });

      await refreshPatients();
      addToast("Welcome back! Logging you in...", "success");
      navigate("/dashboard");
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Invalid email or password.";
      addToast(errMsg, "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmailOrPhone.trim()) {
      setForgotError("Please enter your phone number or email.");
      return;
    }
    setForgotError("");
    setIsForgotSubmitted(true);
    addToast("Reset code sent! Please check your mobile or email.", "success");
  };

  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
    setForgotEmailOrPhone("");
    setForgotError("");
    setIsForgotSubmitted(false);
  };

  return (
    <div className="flex items-center justify-center py-6 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <Card id="login-card" className="w-full">
          {/* Header */}
          <div className="text-center flex flex-col gap-2 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[15px] text-text-secondary leading-normal">
              Sign in to manage your medication schedule.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="login-input-email"
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

            <div className="relative">
              <Input
                id="login-input-password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
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

            {/* Checkbox and Forgot Password Link */}
            <div className="flex items-center justify-between text-sm mt-1">
              <label htmlFor="login-checkbox-remember" className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="login-checkbox-remember"
                  name="rememberMe"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="w-4.5 h-4.5 rounded border-brand-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
                />
                <span className="text-text-secondary font-medium">Remember me</span>
              </label>

              <button
                id="login-btn-forgot-password"
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-primary hover:text-primary-hover font-bold focus:outline-none focus:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <div className="mt-4">
              <Button
                id="login-submit-btn"
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Login"}
              </Button>
            </div>
          </form>

          {/* Bottom redirection Link */}
          <div className="text-center mt-6 pt-5 border-t border-brand-border">
            <p className="text-sm text-text-secondary font-medium">
              Don't have an account?{" "}
              <Link
                id="login-register-redirect"
                to="/register"
                className="text-primary hover:text-primary-hover font-bold focus:outline-none focus:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        id="forgot-password-modal"
        isOpen={isForgotModalOpen}
        onClose={closeForgotModal}
        title="Reset Password"
      >
        {!isForgotSubmitted ? (
          <form onSubmit={handleForgotSubmit} className="flex flex-col gap-5 text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center self-start mb-1">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              Enter your registered Phone Number or Email Address. We'll send you a custom verification link to reset your password.
            </p>

            <Input
              id="forgot-input"
              name="forgotEmailOrPhone"
              label="Phone Number or Email"
              placeholder="e.g. 9876543210 or name@example.com"
              value={forgotEmailOrPhone}
              onChange={(e) => setForgotEmailOrPhone(e.target.value)}
              error={forgotError}
              required
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button
                id="forgot-cancel-btn"
                variant="secondary"
                onClick={closeForgotModal}
              >
                Cancel
              </Button>
              <Button
                id="forgot-submit-btn"
                type="submit"
                variant="primary"
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-5 text-left">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center self-start mb-1">
              <Check className="w-6 h-6 text-success" />
            </div>

            <h4 className="text-lg font-bold text-text-primary">
              Link Sent Successfully!
            </h4>

            <p className="text-sm text-text-secondary leading-relaxed">
              We have dispatched instructions to <strong className="text-text-primary">{forgotEmailOrPhone}</strong>. Please verify your inbox or messaging app to finalize.
            </p>

            <div className="flex justify-end mt-4">
              <Button
                id="forgot-success-close-btn"
                variant="primary"
                onClick={closeForgotModal}
              >
                Back to Login
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
