'use client';

import React, { useState, useEffect } from 'react';

interface Movie {
  id: string;
  title: string;
  image: string;
  description: string;
  release_date: string;
  rating: number;
}

const SortByDate = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://localhost:7000/api/Films'); 
        if (!response.ok) {
          throw new Error('Помилка завантаження фільмів');
        }
        const data = await response.json();

      
        const fetchedMovies: Movie[] = [];
        for (let i = 0; i < data.length; i++) {
          const movie = data[i];
          fetchedMovies.push({
            id: movie.id.toString(),
            title: movie.title,
            image: movie.image,
            description: movie.description,
            release_date: movie.release_date,
            rating: movie.rating ? movie.rating : Math.floor(Math.random() * 10) + 1,
          });
        }

       
        fetchedMovies.sort((a, b) => {
          const dateA = new Date(a.release_date).getTime();
          const dateB = new Date(b.release_date).getTime();
          return dateB - dateA;
        });

        setMovies(fetchedMovies);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <p className="text-yellow-600 text-center mt-8">Завантаження...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-600 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">Сортування за датою</h1>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-64 object-cover rounded"
            />
            <h2 className="text-2xl font-semibold mt-4">{movie.title}</h2>
            <p className="text-sm text-gray-400 mt-2">{movie.release_date}</p>
            <p className="mt-2">{movie.description.substring(0, 100)}...</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default SortByDate;
