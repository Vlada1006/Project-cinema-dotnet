'use client';


import React, { useState, useEffect, JSX } from 'react';

const Genres = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('https://localhost:7000/api/Genres'); 
        const data = await response.json();
        setGenres(data.genres || []); 
      } catch (error) {
        console.error('Помилка завантаження жанрів:', error);
      }
    };
    
    fetchGenres();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre);
    }
  }, [selectedGenre]);

  const fetchMoviesByGenre = async (genre: string) => {
    try {
      const response = await fetch('https://localhost:7000/api/Genres');
      const data = await response.json();
      const filteredMovies = data.filter((movie: any) => movie.description.includes(genre));
      setMovies(filteredMovies || []);  
    } catch (error) {
      console.error('Помилка завантаження фільмів:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-yellow-600 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Жанри фільмів</h1>
      <div className="mb-4">
        <label className="block text-lg mb-2">Оберіть жанр:</label>
        <select
          className="p-2 bg-gray-800 rounded w-full"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Всі жанри</option>
          {
            
            (() => {
              const genreOptions: JSX.Element[] = [];
              for (let i = 0; i < genres.length; i++) {
                genreOptions.push(
                  <option key={genres[i]} value={genres[i]}>
                    {genres[i]}
                  </option>
                );
              }
              return genreOptions;
            })()
          }
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          
          (() => {
            const movieItems: JSX.Element[] = [];
            if (movies && movies.length > 0) {
              for (let i = 0; i < movies.length; i++) {
                movieItems.push(
                  <div key={movies[i].id} className="bg-gray-800 p-4 rounded-lg">
                    <img
                      src={movies[i].image}
                      alt={movies[i].title}
                      className="w-full h-64 object-cover rounded"
                    />
                    <h3 className="text-xl font-bold mt-2">{movies[i].title}</h3>
                    <p className="text-sm text-gray-400">{movies[i].release_date}</p>
                    <p className="mt-2">{movies[i].description.substring(0, 100)}...</p>
                  </div>
                );
              }
            } else {
              movieItems.push(
                <p key="no-movies" className="text-gray-400">
                  Оберіть жанр, щоб переглянути фільми.
                </p>
              );
            }
            return movieItems;
          })()
        }
      </div>
    </div>
  );
};

export default Genres;
