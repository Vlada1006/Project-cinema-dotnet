"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const Home = () => {
  interface Movie {
    id: string;
    image: string;
    title: string;
    description: string;
    release_date: string;
    rating: number;
  }

  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setClientReady(true); // Only proceed when the component is mounted
    const fetchMovies = async () => {
      try {
        const response = await fetch("API");
        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();

        const formattedMovies = data.map((movie: any) => ({
          id: movie.id.toString(),
          image: movie.url,
          title: movie.title,
          description: "Some example movie description.",
          release_date: new Date().toISOString().split("T")[0],
          rating: Math.floor(Math.random() * 10) + 1, // Generated only on the client
        }));

        setMovies(formattedMovies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies. Please try again.");
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">CinemaHub</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search movies..."
            className="w-64 p-2 bg-gray-800 rounded"
          />
          <button className="p-2 bg-gray-700 rounded">🔍</button>
          <button className="p-2 bg-gray-900 rounded" onClick={() => (window.location.href = "/booking")}>
            Book Now
          </button>
          <button className="p-2 bg-gray-900 rounded" onClick={() => (window.location.href = "/genres")}>
            Genres
          </button>
          <button className="p-2 bg-gray-900 rounded">Account</button>
        </div>
      </header>

      {/* Movie Carousel */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Watch now</h2>

        {sortedMovies.length > 0 && (
          <div className="relative">
            <div className="w-full h-[500px] bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={sortedMovies[currentIndex].image}
                alt={sortedMovies[currentIndex].title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center w-full">
              <h3 className="font-bold text-xl">{sortedMovies[currentIndex].title}</h3>
              <p className="text-sm text-gray-400">{formatDate(sortedMovies[currentIndex].release_date)}</p>
              <p className="text-sm mt-2">{sortedMovies[currentIndex].description.substring(0, 100)}...</p>
              <p className="text-sm mt-2 font-semibold">Rating: {sortedMovies[currentIndex].rating}/10</p>
            </div>

            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <button onClick={handlePrevMovie} className="p-2 bg-gray-800 text-white rounded-full">
                &#8592;
              </button>
            </div>

            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <button onClick={handleNextMovie} className="p-2 bg-gray-800 text-white rounded-full">
                &#8594;
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Top Rated Movies */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Top Rated Movies</h2>
        <div className="grid grid-cols-3 gap-6">
          {sortedMovies.slice(0, 6).map((movie) => (
            <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <img src={movie.image} alt={movie.title} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{movie.title}</h3>
                <p className="text-sm text-gray-400">{formatDate(movie.release_date)}</p>
                <p className="text-sm mt-2 font-semibold">Rating: {movie.rating}/10</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-12 text-center text-sm text-gray-400">
        <p>&copy; 2025 CinemaHub. All rights reserved.</p>
        <p>Contact us at: info@cinemahub.com</p>
      </footer>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });


