"use client";
import React, { useState, useEffect } from "react";

// Типи для бронювання
interface Booking {
  id: number;
  sessionId: number;
  seatId: number;
  userId: number;
  bookingTime: string;
  movieTitle: string;
  seatNumber: number;
  sessionStartTime: string;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Функція для отримання всіх бронювань
  const fetchBookings = async () => {
    try {
      const response = await fetch("https://localhost:7000/api/Bookings");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      if (data && data.data) {
        setBookings(data.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setErrorMessage("An error occurred while fetching bookings. Please try again.");
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
              <th className="text-left p-2">Movie Title</th>
              <th className="text-left p-2">Session Start Time</th>
              <th className="text-left p-2">Seat Number</th>
              <th className="text-left p-2">Booking Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-gray-600">
                <td className="p-2">{booking.movieTitle}</td>
                <td className="p-2">{new Date(booking.sessionStartTime).toLocaleString()}</td>
                <td className="p-2">{booking.seatNumber}</td>
                <td className="p-2">{new Date(booking.bookingTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsPage;
 