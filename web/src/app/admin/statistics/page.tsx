"use client";

import React, { useState } from "react";

interface MovieStats {
  id: number;
  title: string;
  ticketsSold: number;
  revenue: number;
}

const StatisticsPage = () => {
  const [stats, setStats] = useState<MovieStats[]>([]);
  const [filter, setFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const fetchStatistics = async () => {
    if (!startDate || !endDate) {
      setError("Start date and end date must be provided");
      return;
    }
  
    try {
      const response = await fetch("https://localhost:7000/api/admin/statistics", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data: MovieStats[] = await response.json();
  
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }
  
      setStats(data);
      setError("");
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setError("Failed to load statistics. Please try again later.");
    }
  };
  

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
          <div className="flex space-x-4">
            <input
              type="datetime-local"
              className="w-full p-3 bg-gray-800 text-white rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="datetime-local"
              className="w-full p-3 bg-gray-800 text-white rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={fetchStatistics}
          className="w-full p-3 bg-yellow-600 text-white rounded mb-4"
        >
          Отримати статистику
        </button>

        <ul className="space-y-3">
          {filteredStats.length > 0 ? (
            filteredStats.map((stat) => (
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
            ))
          ) : (
            <p className="text-center text-gray-400">Немає доступних даних</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StatisticsPage;
