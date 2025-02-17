"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";

export default function RegistrationForm() {
  const router = useRouter();

  const [emailInputValue, setEmailInputValue] = useState<string>("");
  const [passwordInputValue, setPasswordInputValue] = useState<string>("");

  const [formError, setFormError] = useState<string>("");
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] =
    useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitButtonDisabled(true);

      const formData = new FormData(e.currentTarget);

      const email = formData.get("email");
      const password = formData.get("password");

      if (!email || !password) {
        setFormError("Both email and password are required to register.");
        setIsSubmitButtonDisabled(false);
        return;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.status === 409) {
        setFormError("User with provided email already exists.");
        setIsSubmitButtonDisabled(false);
        return;
      }

      if (!response.ok) {
        setFormError("An error occured while processing your request.");
        setIsSubmitButtonDisabled(false);
        return;
      }

      router.push("/auth/login");
    },
    [router]
  );

  return (
    <div className="flex flex-col items-center min-h-screen gap-10 bg-gray-900">
      <h1 className="text-4xl text-yellow-400 font-bold italic">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mx-auto w-[90%] md:w-[400px] relative p-6 bg-gray-800 rounded-lg shadow-lg"
      >
        <label htmlFor="email-input" className="text-lg text-yellow-400">Email</label>
        <input
          id="email-input"
          name="email"
          className={`px-4 h-12 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
            formError && "border-red-600"
          }`}
          type="email"
          value={emailInputValue}
          onChange={(e) => setEmailInputValue(e.target.value)}
        />
        <label htmlFor="password-input" className="text-lg text-yellow-400">Password</label>
        <input
          id="password-input"
          name="password"
          className={`px-4 h-12 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
            formError && "border-red-600"
          }`}
          type="password"
          value={passwordInputValue}
          onChange={(e) => setPasswordInputValue(e.target.value)}
        />
        <button
          disabled={isSubmitButtonDisabled}
          className="mt-6 rounded-2xl bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 p-4 text-white disabled:bg-gray-600"
          type="submit"
        >
          Register
        </button>
        <div className="relative">
          <p className="absolute text-red-600">{formError}</p>
        </div>
      </form>
      <h2 className="text-yellow-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline italic text-yellow-300 hover:text-yellow-200">
          Login
        </Link>
      </h2>
    </div>
  );
}