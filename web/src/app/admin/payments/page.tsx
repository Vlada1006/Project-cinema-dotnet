"use client";
import React, { useState, useEffect } from "react";

interface Booking {
  id: number;
  userId: string;
  sessionId: number;
  seatId: number;
  transactionId: number;
  bookingTime: string;
}

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Функція для отримання всіх бронювань
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/bookings");
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
      setErrorMessage("An error occurred while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (errorMessage) {
    return <p className="text-red-600">{errorMessage}</p>;
  }

  if (bookings.length === 0) {
    return <p>No bookings available.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-600 p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-600 mb-4">Admin Booking Management</h1>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-700">
              <th className="text-left p-2">User ID</th>
              <th className="text-left p-2">Session ID</th>
              <th className="text-left p-2">Seat ID</th>
              <th className="text-left p-2">Transaction ID</th>
              <th className="text-left p-2">Booking Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-gray-600">
                <td className="p-2">{booking.userId}</td>
                <td className="p-2">{booking.sessionId}</td>
                <td className="p-2">{booking.seatId}</td>
                <td className="p-2">{booking.transactionId}</td>
                <td className="p-2">{new Date(booking.bookingTime).toLocaleString()}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookingPage;
