"use client";

import React, { useState, useEffect } from "react";

interface Payment {
  id: number;
  user: string;
  filmTitle: string;
  bookingTime: string;
  amount: number;
  status: string;
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/payments") // API endpoint для отримання оплат
      .then((response) => response.json())
      .then((data) => setPayments(data))
      .catch((error) => console.error("Error fetching payments:", error));
  }, []);

  const updatePaymentStatus = (id: number, status: string) => {
    fetch(`/api/payments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then(() => {
        setPayments(
          payments.map((payment) =>
            payment.id === id ? { ...payment, status } : payment
          )
        );
      })
      .catch((error) => console.error("Error updating payment status:", error));
  };

  const processRefund = (id: number) => {
    fetch(`/api/payments/${id}/refund`, {
      method: "POST",
    })
      .then(() => {
        setPayments(
          payments.map((payment) =>
            payment.id === id ? { ...payment, status: "Refunded" } : payment
          )
        );
      })
      .catch((error) => console.error("Error processing refund:", error));
  };

  const filteredPayments = payments.filter((payment) =>
    payment.user.toLowerCase().includes(filter.toLowerCase()) ||
    payment.filmTitle.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-700 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-yellow-600 text-center mb-6">
          Оплати за квитки
        </h1>

        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Пошук за ім'ям користувача або назвою фільму"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <ul className="space-y-3">
          {filteredPayments.map((payment) => (
            <li
              key={payment.id}
              className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-4 rounded border border-gray-700"
            >
              <div>
                <h2 className="text-lg font-bold text-yellow-400">
                  🎬 {payment.filmTitle}
                </h2>
                <p>👤 Користувач: {payment.user}</p>
                <p>🗓️ Дата: {payment.bookingTime}</p>
                <p>💵 Сума: {payment.amount} грн</p>
                <p>📄 Статус: {payment.status}</p>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                <select
                  className="p-2 bg-gray-700 text-white rounded"
                  value={payment.status}
                  onChange={(e) => updatePaymentStatus(payment.id, e.target.value)}
                >
                  <option value="Pending">Очікується</option>
                  <option value="Completed">Завершено</option>
                  <option value="Cancelled">Скасовано</option>
                  <option value="Refunded">Повернено</option>
                </select>
                {payment.status !== "Refunded" && (
                  <button
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-500"
                    onClick={() => processRefund(payment.id)}
                  >
                    Повернути
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaymentsPage;
