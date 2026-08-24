import { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Input from "../common/Input";
import api from "../../services/api";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSendOTP = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!name || !email || !password) {
      toastService.error("Name, email and password are required.");
      return;
    }

    if (password.length < 8) {
      toastService.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name,
        email,
        password,
      });

      setStep("verify");
      toastService.success("OTP sent to your email.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toastService.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/verify-email", {
        email: formData.email.trim(),
        otp,
      });

      setSuccess(true);
      toastService.success("Registration successful.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);

      await api.post("/auth/resend-otp", {
        email: formData.email.trim(),
      });

      setOtp("");

      toastService.success("New OTP sent to your email.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6 text-center">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <h1 className="text-2xl font-bold text-green-800">
            Registration Successful
          </h1>

          <p className="mt-2 text-green-700">
            Your email has been verified and your account has been created
            successfully.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/login", {
              replace: true,
            })
          }
          className="w-full rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white transition hover:bg-amber-800"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <form
        onSubmit={handleVerifyOTP}
        className="mx-auto w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Artisan&apos;s Corner
          </p>

          <h1 className="mt-3 text-3xl font-black text-stone-900">
            Verify Your Email
          </h1>

          <p className="mt-2 text-stone-500">Enter the 6-digit OTP sent to</p>

          <p className="mt-1 font-semibold text-stone-800">{formData.email}</p>
        </div>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(event) =>
            setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="Enter 6-digit OTP"
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-center text-xl tracking-[0.5em] focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-100"
          required
        />

        <p className="text-center text-sm text-stone-500">
          OTP is valid for 2 minutes.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="font-semibold text-amber-700 hover:text-amber-800 hover:underline disabled:opacity-60"
          >
            {resendLoading ? "Sending OTP..." : "Resend OTP"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSendOTP}
      className="mx-auto w-full max-w-md space-y-6"
    >
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Artisan&apos;s Corner
        </p>

        <h1 className="mt-3 text-3xl font-black text-stone-900">
          Create Account
        </h1>

        <p className="mt-2 text-stone-500">Join Artisan&apos;s Corner</p>
      </div>

      <Input
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        autoComplete="name"
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        autoComplete="email"
        // pattern="[A-Za-z0-9._-]+@[A-Za-z0-9-]+[.]com"
        title="Please enter a valid .com email address"
        required
      />

      <div className="space-y-2">
        <label
          htmlFor="register-password"
          className="text-sm font-semibold text-stone-700"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-12 transition focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />

          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="register-submit-btn">
        <UserPlus size={18} />
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      <p className="text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-amber-700 hover:text-amber-800 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
