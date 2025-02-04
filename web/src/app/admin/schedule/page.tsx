"use client";

import React, { useState, useEffect } from "react";

interface Movie {
  id: number;
  title: string;
}

interface Session {
  id: number;
  filmId: number;
  filmTitle: string;
  startTime: string;
  endTime: string;
  price: number;
}

const SchedulePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newSession, setNewSession] = useState({
    filmId: 0,
    startTime: "",
    endTime: "",
    price: 0,
  });

  // Fetch movies and sessions
  useEffect(() => {
    // Fetch movies
    fetch("https://localhost:7000/api/Films")
      .then((response) => response.json())
      .then((data) => setMovies(Array.isArray(data) ? data : [])) // Ensure data is an array
      .catch((error) => console.error("Error fetching movies:", error));

    // Fetch sessions
    fetch("https://localhost:7000/api/Films") // Replace with correct endpoint for sessions
      .then((response) => response.json())
      .then((data) => setSessions(Array.isArray(data) ? data : [])) // Ensure data is an array
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  // Add a new session
  const addSession = () => {
    if (newSession.filmId && newSession.startTime && newSession.endTime) {
      fetch("https://localhost:7000/api/Films", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      })
        .then((response) => response.json())
        .then((data) => setSessions([...sessions, data]))
        .catch((error) => console.error("Error adding session:", error));

      setNewSession({
        filmId: 0,
        startTime: "",
        endTime: "",
        price: 0,
      });
    }
  };

  // Delete a session
  const removeSession = (id: number) => {
    fetch(`https://localhost:7000/api/Films/${id}`, { method: "DELETE" })
      .then(() => setSessions(sessions.filter((session) => session.id !== id)))
      .catch((error) => console.error("Error deleting session:", error));
  };

  // Update session price
  const updatePrice = (id: number, newPrice: number) => {
    fetch(`https://localhost:7000/api/Films/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: newPrice }),
    })
      .then(() => {
        setSessions(
          sessions.map((session) =>
            session.id === id ? { ...session, price: newPrice } : session
          )
        );
      })
      .catch((error) => console.error("Error updating price:", error));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
          Список Сеансів на Тиждень
        </h1>

        {/* Add new session */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            className="w-full p-3 bg-gray-800 text-white rounded"
            value={newSession.filmId}
            onChange={(e) =>
              setNewSession({ ...newSession, filmId: parseInt(e.target.value) })
            }
          >
            <option value={0}>Оберіть фільм</option>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))
            ) : (
              <option disabled>Завантаження фільмів...</option>
            )}
          </select>
          <input
            type="datetime-local"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Час початку"
            value={newSession.startTime}
            onChange={(e) =>
              setNewSession({ ...newSession, startTime: e.target.value })
            }
          />
          <input
            type="datetime-local"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Час закінчення"
            value={newSession.endTime}
            onChange={(e) =>
              setNewSession({ ...newSession, endTime: e.target.value })
            }
          />
          <input
            type="number"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Ціна"
            value={newSession.price}
            onChange={(e) =>
              setNewSession({ ...newSession, price: parseFloat(e.target.value) })
            }
          />
          <button
            className="col-span-2 p-3 bg-yellow-600 text-black font-bold rounded hover:bg-yellow-400"
            onClick={addSession}
          >
            Додати Сеанс
          </button>
        </div>

        {/* List of sessions */}
        <ul className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <li
                key={session.id}
                className="flex flex-col md:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg"
              >
                <div>
                  <h2 className="text-lg font-bold text-yellow-500">
                    🎬 {session.filmTitle}
                  </h2>
                  <p>
                    🕒 {session.startTime} - {session.endTime}
                  </p>
                  <p>💵 Ціна: {session.price} грн</p>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0">
                  <input
                    type="number"
                    className="w-24 p-2 bg-gray-800 text-white rounded"
                    defaultValue={session.price}
                    onChange={(e) =>
                      updatePrice(session.id, parseFloat(e.target.value))
                    }
                  />
                  <button
                    className="bg-red-600 p-2 text-white rounded hover:bg-red-500"
                    onClick={() => removeSession(session.id)}
                  >
                    Видалити
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-400">Немає сеансів для показу</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SchedulePage;
