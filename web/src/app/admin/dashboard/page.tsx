"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  // Перевірка токена
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  // Функція для навігації між підсторінками
  const handleNavigate = (path: string) => {
    router.push(`/admin/${path}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-9">
      <h1 className="text-2xl font-bold mb-6 text-yellow-600">Адмін-Панель</h1>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleNavigate("movie")}
          className="bg-yellow-600 text-black px-8 py-4 rounded-lg shadow-md hover:bg-yellow-400"
        >
          🎬 Керування фільмами
        </button>
        <button
          onClick={() => handleNavigate("schedule")}
          className="bg-yellow-600 text-black px-8 py-4 rounded-lg shadow-md hover:bg-yellow-400"
        >
          📅 Керування розкладом
        </button>
        <button
          onClick={() => handleNavigate("payments")}
          className="bg-yellow-600 text-black px-8 py-4 rounded-lg shadow-md hover:bg-yellow-400"
        >
          💰 Оплати
        </button>
        <button
          onClick={() => handleNavigate("statistics")}
          className="bg-yellow-600 text-black px-8 py-4 rounded-lg shadow-md hover:bg-yellow-400"
        >
          📊 Статистика
        </button>
      </div>
    </div>
  );
}
