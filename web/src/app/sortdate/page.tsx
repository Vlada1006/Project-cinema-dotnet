'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Movie {
  id: string;
  posterUrl: string;
  title: string;
  description: string;
  release_date: string;
  duration: number;
  rating: number;
}

const SortByDuration = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 

  const router = useRouter();
  
  const handleMovieClick = (id: string) => {
    router.push(`/movie/${id}`);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://localhost:7000/api/Films');
        if (!response.ok) {
          throw new Error('Помилка завантаження фільмів');
        }
        const data = await response.json();

        if (data && data.data && Array.isArray(data.data)) {
          const fetchedMovies: Movie[] = [];
          for (let i = 0; i < data.data.length; i++) {
            const movie = data.data[i];
            fetchedMovies.push({
              id: movie.id.toString(),
              title: movie.title,
              posterUrl: movie.posterUrl.startsWith('https://')
                ? movie.posterUrl
                : `https://localhost:7000${movie.posterUrl}`,
              description: movie.description,
              release_date: movie.release_date,
              duration: movie.duration,
              rating: movie.rating,
            });
          }

          sortMovies(fetchedMovies);

        } else {
          throw new Error('Невірний формат відповіді');
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [sortOrder]); 

  const sortMovies = (fetchedMovies: Movie[]) => {
    const sortedMovies = [...fetchedMovies];
    if (sortOrder === 'asc') {
      sortedMovies.sort((a, b) => a.duration - b.duration); 
    } else {
      sortedMovies.sort((a, b) => b.duration - a.duration); 
    }
    setMovies(sortedMovies);
  };

  if (loading) {
    return <p className="text-yellow-600 text-center mt-8">Завантаження...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-600 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">Сортування за тривалістю</h1>
      </header>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${sortOrder === 'asc' ? 'bg-gray-700' : 'bg-gray-600'}`}
          onClick={() => setSortOrder('asc')}
        >
          Від меншої до більшої
        </button>
        <button
          className={`px-4 py-2 rounded-md ${sortOrder === 'desc' ? 'bg-gray-700' : 'bg-gray-600'}`}
          onClick={() => setSortOrder('desc')}
        >
          Від більшої до меншої
        </button>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} onClick={() => handleMovieClick(movie.id)} className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-64 object-cover rounded"
              />
              <h2 className="text-2xl font-semibold mt-4">{movie.title}</h2>
              <p className="text-sm text-gray-400 mt-2">{movie.release_date}</p>
              <p className="mt-2">{movie.description.substring(0, 100)}...</p>
              <p className="text-sm text-gray-400 mt-2">Тривалість: {movie.duration} хв.</p>
            </div>
          ))
        ) : (
          <p className="text-center text-white mt-8">Фільми не знайдено</p>
        )}
      </section>
    </div>
  );
};

export default SortByDuration;
