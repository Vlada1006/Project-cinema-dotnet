"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // або ваш контекст, якщо ви його використовуєте
import { selectUserId } from "@/stores/user/selectors"; // ваш селектор для отримання ID користувача

// Типи для бронювання
interface Booking {
  id: number;
  sessionId: number;
  seatId: number;
  userId: number;
  bookingTime: string;
  transactionId: number;
}

interface Session {
  id: number;
  filmId: number;
  startTime: string;
  endTime: string;
  price: number;
  roomId: string; 
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sessions, setSessions] = useState<Record<number, Session>>({});
  const [films, setFilms] = useState<Record<number, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Отримання ID користувача з Redux або контексту
  const userId = useSelector(selectUserId);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Функція для отримання всіх бронювань
  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      if (data && data.data) {
        // Фільтруємо бронювання за ID користувача
        const userBookings = data.data.filter((booking: Booking) => booking.userId === userId);
        setBookings(userBookings);
        // Після отримання бронювань, отримуємо сесії
        fetchSessions(userBookings.map((booking: Booking) => booking.sessionId));
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setErrorMessage("An error occurred while fetching bookings. Please try again.");
    }
  };

  const fetchSessions = async (sessionIds: number[]) => {
    try {
      const sessionPromises = sessionIds.map(sessionId =>
        fetch(`/api/sessions/${sessionId}`).then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch session with id ${sessionId}`);
          }
          return res.json();
        })
      );
  
      const sessionData = await Promise.all(sessionPromises);
      const sessionMap: Record<number, Session> = {};
      const filmIds = new Set<number>();
  
      sessionData.forEach((session: { message: string; data: Session }) => {
        if (session.data) {
          sessionMap[session.data.id] = session.data;
          filmIds.add(session.data.filmId);
        }
      });
  
      setSessions(sessionMap);
  
      fetchFilms(Array.from(filmIds));
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setErrorMessage("An error occurred while fetching sessions. Please try again.");
    }
  };
  
  const fetchFilms = async (filmIds: number[]) => {
    try {
      const filmPromises = filmIds.map(filmId =>
        fetch(`https://localhost:7000/api/Films/${filmId}`).then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch film with id ${filmId}`);
          }
          return res.json();
        })
      );
  
      const filmData = await Promise.all(filmPromises);
      const filmMap: Record<number, string> = {};
  
      filmData.forEach((film) => {
        if (film.data) {
          filmMap[film.data.id] = film.data.title;
        } else {
          console.warn(`Film data for ID ${film.id} is missing or invalid.`);
          filmMap[film.id] = 'Unknown Film';
        }
      });
  
      setFilms(filmMap);
    } catch (error) {
      console.error("Error fetching films:", error);
      setErrorMessage("An error occurred while fetching films. Please try again.");
    }
  };
  
  if (errorMessage) {
    return <p className="text-red-600">{errorMessage}</p>;
  }

  if (bookings.length === 0) {
    return <p>No bookings available.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-600 p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-600 mb-4">Your Bookings</h1>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-700">
              <th className="text-left p-2">Film Title</th>
              <th className="text-left p-2">Session Start Time</th>
              <th className="text-left p-2">Session End Time</th>
              <th className="text-left p-2">Seat Number</th>
              <th className="text-left p-2">Booking Time</th>
              <th className="text-left p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const session = sessions[booking.sessionId];
              return (
                <tr key={booking.id} className="border-t border-gray-600">
                  <td className="p-2">{session ? films[session.filmId] || 'Loading...' : 'Loading...'}</td>
                  <td className="p-2">{session ? new Date(session.startTime).toLocaleString() : 'Loading...'}</td>
                  <td className="p-2">{session ? new Date(session.endTime).toLocaleString() : 'Loading...'}</td>
                  <td className="p-2">{booking.seatId}</td>
                  <td className="p-2">{new Date(booking.bookingTime).toLocaleString()}</td>
                  <td className="p-2">{session ? session.price : 'Loading...'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsPage; 