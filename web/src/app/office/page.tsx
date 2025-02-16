"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/stores/hooks";
import { selectUserEmail } from "@/stores/user/selectors";

interface Booking {
  id: number; 
  userId: string;
  sessionId: number;
  seatId: number;
  transactionId: number;
  bookingTime: string; 
}

const PersonalAccount = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const userEmail = useAppSelector(selectUserEmail);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings?email=${userEmail}`);
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const result = await response.json();
        setBookings(result.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (userEmail) {
      fetchBookings();
    } else {
      router.push("/"); 
    }
  }, [userEmail, router]);

  return (
    <div className="p-6 bg-gray-900 text-yellow-600 min-h-screen">
      <h1 className="text-4xl font-bold">Вітаємо, це ваш особистий кабінет!</h1>
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ваші бронювання</h2>
        {bookings.length === 0 ? (
          <p>У вас немає бронювань.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold">Бронювання ID: {booking.id}</h3>
                <p>Час бронювання: {new Date(booking.bookingTime).toLocaleString()}</p>
                <p>Сесія ID: {booking.sessionId}</p>
                <p>Місце ID: {booking.seatId}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PersonalAccount;