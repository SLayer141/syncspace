"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      toast.error("All fields are required", { duration: 5000, position: "top-center" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (res?.ok) {
        toast.success("Login successful!", { duration: 5000, position: "top-center" });
        router.push("/home");
      } else {
        setError(res?.error || "Login failed");
        toast.error(res?.error || "Login failed", { duration: 5000, position: "top-center" });
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      toast.error("An error occurred during login. Please try again.", { duration: 5000, position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Login</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center mt-2">
          Don't have an account? <Link href="/signup">Signup</Link>
        </p>
      </form>
        <div className="flex items-center my-4 w-full max-w-sm">
          <hr className="flex-grow border-t" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-t" />
        </div>
        <button
          onClick={() => signIn('google')}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg w-full max-w-sm"
        >
          Sign in with Google
        </button>
    </div>
  );
}
