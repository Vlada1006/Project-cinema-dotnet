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
    <div className="flex flex-col items-center mt-10 gap-10">
      <h1 className="text-3xl text-white font-semibold italic">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mx-auto w-[70%] md:w-[400px] relative"
      >
        <label htmlFor="email-input">Email</label>
        <input
          id="email-input"
          name="email"
          className={`px-3 h-10 border border-black rounded-xl ${
            formError && "border-[#FF0000]"
          }`}
          type="email"
          value={emailInputValue}
          onChange={(e) => setEmailInputValue(e.target.value)}
        />
        <label htmlFor="password-input">Password</label>
        <input
          id="password-input"
          name="password"
          className={`px-3 h-10 border border-black rounded-xl ${
            formError && "border-[#FF0000]"
          }`}
          type="password"
          value={passwordInputValue}
          onChange={(e) => setPasswordInputValue(e.target.value)}
        />
        <button
          disabled={isSubmitButtonDisabled}
          className="mt-20 rounded-2xl bg-white/25 hover:bg-black/25 active:bg-black/50 p-5 disabled:text-[#808080] disabled:bg-[#808080]/50"
          type="submit"
        >
          Register
        </button>
        <div className="relative">
          <p className="absolute text-[#FF0000]">{formError}</p>
        </div>
      </form>
      <h2>
        Already have an account?{" "}
        <Link href="/auth/login" className="underline italic">
          Login
        </Link>
      </h2>
    </div>
  );
}
