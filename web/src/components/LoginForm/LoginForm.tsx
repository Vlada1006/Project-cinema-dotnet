"use client";
import { useAppDispatch } from "@/stores/hooks";
import { fetchUser } from "@/stores/user/user.slice";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";


export default function LoginForm() {
  const dispatch = useAppDispatch();
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
        setFormError("Both email and password are required to login.");
        setIsSubmitButtonDisabled(false);
        return;
      }

      const authResponse = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!authResponse || authResponse.error) {
        setFormError("Could not authenticate with provided credentials.");
        setIsSubmitButtonDisabled(false);
        return;
      }

      dispatch(fetchUser());
      router.push("/");
      router.refresh();
    },
    [router, dispatch]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmailInputValue(e.target.value);
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordInputValue(e.target.value);
    },
    []
  );

  return (
    <div className="flex flex-col items-center min-h-screen gap-10 bg-gray-900">
      <h1 className="text-4xl text-yellow-400 font-bold italic">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col text-yellow-400 gap-4 mx-auto w-[90%] md:w-[400px] relative p-6 bg-gray-800 rounded-lg shadow-lg"
      >
        <label htmlFor="email-input" className="text-lg">Email</label>
        <input
          id="email-input"
          name="email"
          className={`px-4 h-12 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
            formError && "border-red-600"
          }`}
          type="email"
          value={emailInputValue}
          onChange={handleEmailChange}
        />
        <label htmlFor="password-input" className="text-lg">Password</label>
        <input
          id="password-input"
          name="password"
          className={`px-4 h-12 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
            formError && "border-red-600"
          }`}
          type="password"
          value={passwordInputValue}
          onChange={handlePasswordChange}
        />
        <button
          disabled={isSubmitButtonDisabled}
          className="mt-6 rounded-2xl bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 p-4 text-white disabled:bg-gray-600"
          type="submit"
        >
          Login
        </button>
        <div className="relative">
          <p className="absolute text-red-600">{formError}</p>
        </div>
      </form>
      <h2 className="text-yellow-400">
        Don&apos;t have an account yet?{" "}
        <Link href="/auth/register" className="underline italic text-yellow-300 hover:text-yellow-200">
          Register
        </Link>
      </h2>
    </div>
  );
}