import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";

const ROLE_HOME = {
  admin: "/dashboard",
  teacher: "/teacher",
  student: "/student"
};

export default function Login() {
  const navigate = useNavigate();

  const { user, profile, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect users who are already logged in.
  useEffect(() => {
    if (!loading && user) {
      const destination = profile
        ? ROLE_HOME[profile.role] || "/access-pending"
        : "/access-pending";

      navigate(destination, { replace: true });
    }
  }, [user, profile, loading, navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      // AuthContext detects the successful login
      // and loads the user's profile.
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-xl bg-brand text-2xl font-extrabold text-white">
            L
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Welcome to LabTrack
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Laboratory Attendance Management System
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <label className="mb-4 block text-sm font-medium">
            School Email

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your school email"
              autoComplete="username"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand/40"
            />
          </label>

          <label className="mb-5 block text-sm font-medium">
            Password

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand/40"
            />
          </label>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Authorized students, teachers, and administrators only.
          Contact your administrator if you need an account.
        </p>

      </div>
    </div>
  );
}