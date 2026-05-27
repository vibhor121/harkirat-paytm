import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";
import ErrorAlert from "../components/ErrorAlert";
import * as api from "../lib/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { ok, data } = await api.signup(form);
      if (!ok) {
        setError((data as any).message || "Signup failed. Please try again.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", `${form.firstName} ${form.lastName}`);
      navigate("/dashboard");
    } catch {
      setError("Could not connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <div className="mb-6 text-center">
        <span className="text-[#002970] font-black text-3xl tracking-tight">
          Pay<span className="text-[#00BAF2]">TM</span>
        </span>
        <p className="text-gray-500 text-sm mt-1">India's most-loved payments app</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
        <p className="text-gray-500 text-sm mb-6">Fill in the details below to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <InputField
              label="First Name"
              name="firstName"
              placeholder="Rayan"
              value={form.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
            />
            <InputField
              label="Last Name"
              name="lastName"
              placeholder="Khan"
              value={form.lastName}
              onChange={handleChange}
              required
              autoComplete="family-name"
            />
          </div>

          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          {error && <ErrorAlert message={error} />}

          <Button type="submit" disabled={loading} fullWidth size="lg">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/signin" className="text-[#00BAF2] font-semibold hover:text-[#009FD4] transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        By continuing, you agree to Paytm's Terms & Privacy Policy.
      </p>
    </div>
  );
}
