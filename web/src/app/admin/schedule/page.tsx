"use client";

import React, { useState, useEffect } from "react";

interface Genre {
  id: number;
  name: string;
}

interface Director {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  rating: number;
  duration: number;
  language: string;
  posterUrl: string;
  trailerUrl: string;
  genres: Genre[];
  directors: Director[];
  sessions: Session[];
}

interface Session {
  id: number;
  filmId: number;
  startTime: string;
  endTime: string;
  price: number;
  hall: string;
}

const halls = ["Зал 1", "Зал 2", "Зал 3"];

const SchedulePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newSession, setNewSession] = useState({
    filmId: 0,
    startTime: "",
    endTime: "",
    price: 0,
    hall: ""
  });

  useEffect(() => {
    fetch("https://localhost:7000/api/Films")
      .then((response) => response.json())
      .then((data) => {
        console.log("Received data:", data);
        if (Array.isArray(data.data)) {
          setMovies(data.data);
        } else {
          console.error("Received data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const isValidSession = () => {
    const { filmId, startTime, endTime, price, hall } = newSession;
    if (!filmId || !startTime || !endTime || !hall) return false;
    if (price < 0) return false;

    const now = new Date().toISOString();
    if (startTime < now || endTime <= startTime) return false;

    const conflictingSession = movies.some((movie) =>
      movie.sessions?.some(
        (session) =>
          session.hall === hall &&
          ((startTime >= session.startTime && startTime < session.endTime) ||
           (endTime > session.startTime && endTime <= session.endTime) ||
           (startTime <= session.startTime && endTime >= session.endTime))
      )
    );
    
    if (conflictingSession) {
      alert("У вибраному залі вже йде інший сеанс у цей час!");
      return false;
    }
    return true;
  };

  const addSession = () => {
    if (!isValidSession()) return;

    // Define newSessionPayload here
    const newSessionPayload = {
      filmId: newSession.filmId,
      roomId: halls.indexOf(newSession.hall) + 1,  // Convert hall to roomId
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      price: newSession.price,
    };

    fetch("https://localhost:7000/api/Sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSessionPayload),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Server response:", data); // Додаткове логування відповіді
        if (data.success) {
          setMovies((prevMovies) => {
            return prevMovies.map((movie) =>
              movie.id === data.session.filmId
                ? { ...movie, sessions: [...(movie.sessions || []), data.session] }
                : movie
            );
          });
          setNewSession({ filmId: 0, startTime: "", endTime: "", price: 0, hall: "" });
        } else {
          alert(`Failed to add session: ${data.message || "Unknown error"}`);
        }
      })
      .catch((error) => {
        console.error("Error adding session:", error);
        alert(`An error occurred: ${error.message}`);
      });
    
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
          Список Сеансів на Тиждень
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <label className="text-gray-400">Оберіть фільм:</label>
          <select
            className="w-full p-3 bg-gray-800 text-white rounded"
            value={newSession.filmId}
            onChange={(e) => setNewSession({ ...newSession, filmId: parseInt(e.target.value) })}
          >
            <option value={0}>Оберіть фільм</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>{movie.title}</option>
            ))}
          </select>

          <label className="text-gray-400">Час початку:</label>
          <input
            type="datetime-local"
            className="w-full p-3 bg-gray-800 text-white rounded"
            value={newSession.startTime}
            onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
          />

          <label className="text-gray-400">Час завершення:</label>
          <input
            type="datetime-local"
            className="w-full p-3 bg-gray-800 text-white rounded"
            value={newSession.endTime}
            onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
          />

          <label className="text-gray-400">Ціна квитка (грн):</label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800 text-white rounded"
            value={newSession.price}
            onChange={(e) => setNewSession({ ...newSession, price: Math.max(0, parseFloat(e.target.value)) })}
          />

          <label className="text-gray-400">Оберіть зал:</label>
          <select
            className="w-full p-3 bg-gray-800 text-white rounded"
            value={newSession.hall}
            onChange={(e) => setNewSession({ ...newSession, hall: e.target.value })}
          >
            <option value="">Оберіть зал</option>
            {halls.map((hall) => (
              <option key={hall} value={hall}>{hall}</option>
            ))}
          </select>

          <button
            className="col-span-2 p-3 bg-yellow-600 text-black font-bold rounded hover:bg-yellow-400"
            onClick={addSession}
          >
            Додати Сеанс
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
