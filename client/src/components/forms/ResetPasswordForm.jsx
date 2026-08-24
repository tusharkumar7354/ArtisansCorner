import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../services/api";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const ResetPasswordForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      toastService.error(
        "Email information is missing."
      );

      navigate("/forgot-password", {
        replace: true,
      });

      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toastService.error(
        "Please enter a valid 6-digit OTP."
      );
      return;
    }

    if (newPassword.length < 8) {
      toastService.error(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toastService.error(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      toastService.success(
        "Password reset successfully."
      );

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      toastService.error(
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md space-y-6"
    >
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Artisan&apos;s Corner
        </p>

        <h1 className="mt-3 text-3xl font-black text-stone-900">
          Reset Password
        </h1>

        <p className="mt-2 text-stone-500">
          Enter the OTP sent to
        </p>

        <p className="mt-1 font-semibold text-stone-800">
          {email}
        </p>
      </div>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(event) =>
          setOtp(
            event.target.value
              .replace(/\D/g, "")
              .slice(0, 6)
          )
        }
        placeholder="Enter 6-digit OTP"
        className="w-full rounded-xl border border-stone-300 px-4 py-3 text-center text-xl tracking-[0.5em] focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-100"
        required
      />

      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="text-sm font-semibold text-stone-700"
        >
          New Password
        </label>

        <div className="relative">
          <input
            id="new-password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={newPassword}
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
            placeholder="Minimum 8 characters"
            minLength={8}
            required
            className="w-full rounded-xl border border-stone-300 px-4 py-3 pr-12 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (previous) => !previous
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className="text-sm font-semibold text-stone-700"
        >
          Confirm Password
        </label>

        <div className="relative">
          <input
            id="confirm-password"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            placeholder="Confirm new password"
            minLength={8}
            required
            className="w-full rounded-xl border border-stone-300 px-4 py-3 pr-12 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (previous) => !previous
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:opacity-60"
      >
        {loading
          ? "Resetting Password..."
          : "Reset Password"}
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

export default ResetPasswordForm;