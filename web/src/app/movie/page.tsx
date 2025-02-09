'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Movie {
  id: string;
  image: string;
  title: string;
  description: string;
  release_date: string;
  rating: number;
}

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await fetch(`https://localhost:7000/api/Films/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const data = await response.json();
      setMovie(data);
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <div className="text-yellow-600">Завантаження...</div>;

  return (
    <div className="p-6 bg-gray-900 text-yellow-600 min-h-screen">
      <button className="mb-4 p-2 bg-gray-700 rounded" onClick={() => history.back()}>
        ⬅ Назад
      </button>

      <div className="grid grid-cols-2 gap-8">
        <img src={movie.image} alt={movie.title} className="w-full h-auto rounded-lg" />
        <div>
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-gray-400">{movie.release_date}</p>
          <p className="text-yellow-500 text-lg">⭐ {movie.rating}</p>
          <p className="mt-4">{movie.description}</p>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
