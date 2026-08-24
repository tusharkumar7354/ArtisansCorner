import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Input from "../common/Input";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toastService.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      toastService.success("Password reset OTP sent.");

      navigate("/reset-password", {
        state: {
          email: email.trim(),
        },
      });
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Artisan&apos;s Corner
        </p>

        <h1 className="mt-3 text-3xl font-black text-stone-900">
          Forgot Password
        </h1>

        <p className="mt-2 text-stone-500">
          Enter your email to receive a password reset OTP.
        </p>
      </div>

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        autoComplete="email"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:opacity-60"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      <p className="text-center text-sm text-stone-600">
        Remember your password?{" "}
        <Link
          to="/login"
          className="font-semibold text-amber-700 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
