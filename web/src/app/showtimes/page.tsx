'use client';

import React, { useState, useEffect } from 'react';

interface Showtime {
  movieId: number;
  movieTitle: string;
  startTime: string;
  endTime: string;
}

interface ShowtimesData {
  date: string;
  showtimes: Showtime[];
}

const ShowtimesCalendar = () => {
  const [calendarData, setCalendarData] = useState<ShowtimesData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch('https://localhost:7000/api/Sessions');
        if (!response.ok) {
          throw new Error('Помилка завантаження даних про покази');
        }
        const data = await response.json();

     
        if (Array.isArray(data)) {
          setCalendarData(data);
          if (data.length > 0) {
            setSelectedDate(data[0].date); 
          }
        } else {
          throw new Error('Неправильний формат даних з API');
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, []);


  const selectedData = calendarData.find((data) => data.date === selectedDate);

  if (loading) {
    return <p className="text-white text-center mt-8">Завантаження...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">Календар показів</h1>
      </header>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Оберіть дату</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {calendarData.map((data) => (
            <button
              key={data.date}
              className={`px-4 py-2 rounded ${selectedDate === data.date ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => setSelectedDate(data.date)}
            >
              {data.date}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Сеанси на {selectedDate}</h2>
        {selectedData && selectedData.showtimes.length > 0 ? (
          <ul className="space-y-4">
            {selectedData.showtimes.map((showtime, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-semibold">{showtime.movieTitle}</h3>
                <p className="text-gray-400">
                  Час початку: {new Date(showtime.startTime).toLocaleTimeString()}<br />
                  Час завершення: {new Date(showtime.endTime).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">На цю дату показів немає.</p>
        )}
      </div>
    </div>
  );
};

export default ShowtimesCalendar;
