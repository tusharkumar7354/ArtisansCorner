import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Input from "../common/Input";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      toastService.error("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      toastService.success("Login successful.", {
        position: "top-center",
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 1000);
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
          Welcome Back
        </h1>

        <p className="mt-2 text-stone-500">Login to your account</p>
      </div>

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        autoComplete="email"
        required
      />

      <div className="space-y-2">
        <label
          htmlFor="login-password"
          className="text-sm font-semibold text-stone-700"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-12 transition focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-amber-700 hover:text-amber-800 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

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

      <button type="submit" disabled={loading} className="login-submit-btn">
        <LogIn size={18} />

        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm text-stone-600">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-amber-700 hover:text-amber-800 hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
