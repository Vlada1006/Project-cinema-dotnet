"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Для виводу помилки
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log("Введено:", trimmedEmail, trimmedPassword); // Лог введених даних

    if (trimmedEmail === "admin@example.com" && trimmedPassword === "admin") {
      localStorage.setItem("token", "fake-jwt-token");
      router.push("/admin/dashboard");
    } else {
      setErrorMessage("Невірний email або пароль"); // Відображаємо помилку
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-yellow-600 text-center">Вхід в адмін-панель</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 bg-gray-700 text-white border rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-2 mb-3 bg-gray-700 text-white border rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMessage && (
            <p className="text-red-600 text-center mb-3">{errorMessage}</p> // Вивід помилки
          )}
          <button
            type="submit"
            className="w-full bg-yellow-600 text-black py-2 rounded hover:bg-yellow-400 transition"
          >
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
}
