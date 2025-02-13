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
  roomId: string; // Зміна з hall на roomId
}

interface Hall {
  id: number;
  name: string;
}

const SchedulePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newSession, setNewSession] = useState({
    filmId: 0,
    startTime: "",
    endTime: "",
    price: 0,
    hall: "",
  });
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [newHall, setNewHall] = useState("");
  const [hallType, setHallType] = useState("");
  const [rowsCount, setRowsCount] = useState(0);
  const [seatsPerRow, setSeatsPerRow] = useState(0);
  const [totalSeats, setTotalSeats] = useState(0);

  useEffect(() => {
    fetch("https://localhost:7000/api/Films")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setMovies(data.data);
        } else {
          console.error("Received data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching movies:", error));

    fetch("https://localhost:7000/api/Rooms")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setHalls(data.data.map((hall: { id: number; name: string }) => ({ id: hall.id, name: hall.name })));
        } else {
          console.error("Received halls data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching halls:", error));

    fetch("https://localhost:7000/api/Sessions")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setSessions(data.data);
        } else {
          console.error("Received sessions data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  const isValidSession = () => {
    const { filmId, startTime, endTime, price, hall } = newSession;
    if (!filmId || !startTime || !endTime || !hall) {
      console.log("Invalid input: Missing fields");
      return false;
    }
    if (price < 0) {
      console.log("Invalid price");
      return false;
    }

    const now = new Date().toISOString();
    if (startTime < now || endTime <= startTime) {
      console.log("Invalid time range");
      return false;
    }

    const conflictingSession = movies.some((movie) =>
      movie.sessions?.some(
        (session) =>
          session.roomId === hall && // Зміна з hall на roomId
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
    console.log("Додавання сесії...");

    if (!newSession.startTime || !newSession.endTime || !newSession.filmId || !newSession.hall) {
      alert("Будь ласка, заповніть усі поля.");
      return;
    }

    const filmId = newSession.filmId;
    const roomId = parseInt(newSession.hall);
    const startTimeISO = new Date(newSession.startTime).toISOString();
    const endTimeISO = new Date(newSession.endTime).toISOString();
    const price = newSession.price;

    const newSessionPayload = {
      filmId,
      roomId,
      startTime: startTimeISO,
      endTime: endTimeISO,
      price: price.toFixed(2),
    };

    console.log("Payload for POST:", newSessionPayload);

    fetch("https://localhost:7000/api/Sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSessionPayload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(errorText);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        if (data && data.session) {
          setSessions((prevSessions) => [...prevSessions, data.session]);
        }

        setNewSession({
          filmId: 0,
          startTime: "",
          endTime: "",
          price: 0,
          hall: "",
        });

        alert("Сеанс успішно додано!");
      })
      .catch((error) => {
        console.error("Error adding session:", error);
        alert(`An error occurred: ${error.message}`);
      });
  };

  const editSession = (session: Session) => {
    setEditingSession(session);
    setNewSession({
      filmId: session.filmId,
      startTime: session.startTime,
      endTime: session.endTime,
      price: session.price,
      hall: session.roomId, // Зміна з hall на roomId
    });
  };

  const updateSession = () => {
    if (!editingSession) return;

    const updatedSessionPayload = {
      ...editingSession,
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      price: newSession.price.toFixed(2),
      roomId: newSession.hall, // Зміна з hall на roomId
    };

    fetch(`https://localhost:7000/api/Sessions/${editingSession.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSessionPayload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(errorText);
          });
        }
        return response.json();
      })
      .then((data) => {
        setSessions((prevSessions) =>
          prevSessions.map((session) => (session.id === editingSession.id ? data.session : session))
        );

        setEditingSession(null);
        setNewSession({
          filmId: 0,
          startTime: "",
          endTime: "",
          price: 0,
          hall: "",
        });

        alert("Сеанс успішно оновлено!");
      })
      .catch((error) => {
        console.error("Error updating session:", error);
        alert(`An error occurred: ${error.message}`);
      });
  };

  const deleteSession = (sessionId: number) => {
    fetch(`https://localhost:7000/api/Sessions/${sessionId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(errorText);
          });
        }
        setSessions((prevSessions) => prevSessions.filter((session) => session.id !== sessionId));
        alert("Сеанс успішно видалено!");
      })
      .catch((error) => {
        console.error("Error deleting session:", error);
        alert(`An error occurred: ${error.message}`);
      });
  };

  const addHall = () => {
    if (newHall.trim() === "") {
      alert("Будь ласка, введіть назву нового залу.");
      return;
    }

    if (!hallType || rowsCount <= 0 || seatsPerRow <= 0 || totalSeats <= 0) {
      alert("Будь ласка, заповніть всі поля для нового залу.");
      return;
    }

    const newHallPayload = {
      name: newHall,
      type: hallType,
      rows: rowsCount,
      seatsPerRow: seatsPerRow,
      totalSeats: totalSeats,
    };

    console.log("Payload for adding new hall:", newHallPayload);

    fetch("https://localhost:7000/api/Rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHallPayload),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Server response for hall addition:", data);
        if (data.success || data.message === "Room successfully created") {
          setHalls((prevHalls) => [...prevHalls, { id: data.roomId, name: newHall }]);
          setNewHall("");
          setHallType("");
          setRowsCount(0);
          setSeatsPerRow(0);
          setTotalSeats(0);
          alert("Зал успішно додано!");
        } else {
          alert(`Failed to add hall: ${data.message || "Unknown error"}`);
        }
      })
      .catch((error) => {
        console.error("Error adding hall:", error);
        alert(`An error occurred: ${error.message}`);
      });
  };

  const cancelEdit = () => {
    setEditingSession(null);
    setNewSession({
      filmId: 0,
      startTime: "",
      endTime: "",
      price: 0,
      hall: "",
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
              <option key={hall.id} value={hall.id}>
                {hall.name}
              </option>
            ))}
          </select>

          {/* Add new hall */}
          <label className="text-gray-400">Додати новий зал:</label>
          <input
            type="text"
            className=" p-3 bg-gray-800 text-white rounded"
            value={newHall}
            onChange={(e) => setNewHall(e.target.value)}
            placeholder="Назва нового залу"
          />
          <label className="text-gray-400">Тип залу:</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-800 text-white rounded"
            value={hallType}
            onChange={(e) => setHallType(e.target.value)}
            placeholder="Тип залу (наприклад: VIP, стандартний)"
          />

          <label className="text-gray-400">Кількість рядів:</label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800 text-white rounded"
            value={rowsCount}
            onChange={(e) => setRowsCount(Math.max(0, parseInt(e.target.value)))}
          />

          <label className="text-gray-400">Місць в ряді:</label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800 text-white rounded"
            value={seatsPerRow}
            onChange={(e) => setSeatsPerRow(Math.max(0, parseInt(e.target.value)))}
          />

          <label className="text-gray-400">Загальна кількість місць:</label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800 text-white rounded"
            value={totalSeats}
            onChange={(e) => setTotalSeats(Math.max(0, parseInt(e.target.value)))}
          />

          <button
            className="col-span-2 p-3 bg-yellow-600 text-black font-bold rounded hover:bg-yellow-400"
            onClick={addHall}
          >
            Додати Зал
          </button>

          <button
            className="col-span-2 p-3 bg-yellow-600 text-black font-bold rounded hover:bg-yellow-400"
            onClick={addSession}
          >
            Додати Сеанс
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-yellow-600">Список сеансів</h2>
          <table className="w-full table-auto mt-4">
            <thead>
              <tr>
                <th className="text-left text-gray-400">Фільм</th>
                <th className="text-left text-gray-400">Час початку</th>
                <th className="text-left text-gray-400">Час завершення</th>
                <th className="text-left text-gray-400">Ціна</th>
                <th className="text-left text-gray-400">Зал</th>
                <th className="text-left text-gray-400">Дії</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const movie = movies.find(movie => movie.id === session.filmId);
                const hall = halls.find(hall => hall.id === session.roomId); // Зміна з hall на roomId
                return (
                  <tr key={session.id}>
                    <td className="py-2 px-4">{movie ? movie.title : "Невідомий фільм"}</td>
                    <td className="py-2 px-4">{new Date(session.startTime).toLocaleString()}</td>
                    <td className="py-2 px-4">{new Date(session.endTime).toLocaleString()}</td>
                    <td className="py-2 px-4">{session.price} грн</td>
                    <td className="py-2 px-4">{hall ? hall.name : "Невідомий зал"}</td>
                    <td className="py-2 px-4">
                      <button
                        className="text-yellow-500 hover:underline"
                        onClick={() => editSession(session)}
                      >
                        Редагувати
                      </button>
                      <button
                        className="text-red-500 hover:underline ml-2"
                        onClick={() => deleteSession(session.id)}
                      >
                        Видалити
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {editingSession && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-yellow-600">Редагувати сеанс</h2>
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
                className=" w-full p-3 bg-gray-800 text-white rounded"
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
                  <option key={hall.id} value={hall.id}>
                    {hall.name}
                  </option>
                ))}
              </select>

              <button
                className="col-span-2 p-3 bg-yellow-600 text-black font-bold rounded hover:bg-yellow-400"
                onClick={updateSession}
              >
                Оновити Сеанс
              </button>
              <button
                className="col-span-2 p-3 bg-red-600 text-white font-bold rounded hover:bg-red-400"
                onClick={cancelEdit}
              >
                Скасувати
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;