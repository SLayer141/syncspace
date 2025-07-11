"use client";

import { useSession } from "next-auth/react";
import { useState, FormEvent, ChangeEvent } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState<string>(session?.user?.name || "");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // In a real app, you'd send the updated name to your backend here
    alert("Profile updated! (Demo only)");
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-semibold">Name</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition mt-2"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
} 