"use client";

import React, { useState, useEffect } from "react";

interface MovieStats {
  id: number;
  title: string;
  ticketsSold: number;
  revenue: number;
}

const StatisticsPage = () => {
  const [stats, setStats] = useState<MovieStats[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("https://localhost:7000/api/Films") // Замініть на ваш API для отримання статистики
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching statistics:", error));
  }, []);

  const filteredStats = stats.filter((stat) =>
    stat.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-700 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-yellow-600 text-center mb-6">
          Статистика фільмів
        </h1>

        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Пошук за назвою фільму"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <ul className="space-y-3">
          {filteredStats.map((stat) => (
            <li
              key={stat.id}
              className="flex justify-between items-center bg-gray-800 p-4 rounded border border-gray-700"
            >
              <div>
                <h2 className="text-lg font-bold text-yellow-400">
                  🎬 {stat.title}
                </h2>
                <p>🎟️ Продано квитків: {stat.ticketsSold}</p>
                <p>💵 Дохід: {stat.revenue} грн</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StatisticsPage;
