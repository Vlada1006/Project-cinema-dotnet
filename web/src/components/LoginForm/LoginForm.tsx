"use client";
import { useAppDispatch } from "@/stores/hooks";
import { fetchUser, setUser } from "@/stores/user/user.slice";
import { getServerSession } from "next-auth";
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
    <div className="flex flex-col items-center mt-10 gap-10">
      <h1 className="text-3xl text-white font-semibold italic">Login</h1>
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
          onChange={handleEmailChange}
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
          onChange={handlePasswordChange}
        />
        <button
          disabled={isSubmitButtonDisabled}
          className="mt-20 rounded-2xl bg-white/25 hover:bg-black/25 active:bg-black/50 p-5 disabled:text-[#808080] disabled:bg-[#808080]/50"
          type="submit"
        >
          Login
        </button>
        <div className="relative">
          <p className="absolute text-[#FF0000]">{formError}</p>
        </div>
      </form>
      <h2>
        Don&apos;t have an account yet?{" "}
        <Link href="/auth/register" className="underline italic">
          Register
        </Link>
      </h2>
    </div>
  );
}
