"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Genre {
  id: number;
  name: string;
}

interface Director {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  rating: number;
  duration: number;
  language: string;
  posterUrl: string;
  trailerUrl: string;
  genres: Genre[];
  directors: Director[];
}

interface Session {
  id: number;
  startTime: string;
  endTime: string;
  price: number;
  roomId: string;
  movieId: string;
  filmId: string;
}

const MovieDetailsPage = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [movieId, setMovieId] = useState<string | null>(null);
  const [showSessions, setShowSessions] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showBookingButton, setShowBookingButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const pathSegments = window.location.pathname.split("/");
    const movieId = pathSegments[pathSegments.length - 1];
    if (movieId) {
      setMovieId(movieId);
      fetchMovieDetails(movieId);
    }
  }, []);

  const fetchMovieDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/movies/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      if (data && data.data) {
        setMovie(data.data);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setMovie(null);
    }
  };

  const fetchSessions = async (movieId: string) => {
    try {
      const response = await fetch(`https://localhost:7000/api/Sessions?filmId=${movieId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      const data = await response.json();
      if (data && data.data) {
        const filteredSessions = data.data.filter((session: Session) => {
          const sessionStartTime = new Date(session.startTime);
          const currentTime = new Date();
          return session.filmId.toString() === movieId && sessionStartTime >= currentTime;
        });
  
        setSessions(filteredSessions);
        setShowBookingButton(filteredSessions.length > 0);
      } else {
        setSessions([]);
        setShowBookingButton(false);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
      setShowBookingButton(false);
    }
  };
  
  const handleShowSessions = () => {
    if (movieId) {
      fetchSessions(movieId);
    }
    setShowSessions(true);
  };

  const handleBookSession = () => {
    const isAuthenticated = localStorage.getItem("authToken");
    if (isAuthenticated) {
      if (selectedSession) {
        console.log("Booking session:", selectedSession);
        alert(`You booked a session at ${selectedSession.roomId} starting at ${new Date(selectedSession.startTime).toLocaleTimeString()}`);
        router.push(`/booking?movieId=${movieId}`);
      }
    } else {
      router.push(`/auth/login?redirectTo=/booking?movieId=${movieId}`);
    }
  };

  if (!isClient || !movie) return <p>Loading...</p>;

  const posterUrl = movie.posterUrl && movie.posterUrl.startsWith("https://")
    ? movie.posterUrl
    : movie.posterUrl
    ? `https://localhost:7000${movie.posterUrl}`
    : "/images/default-image.jpg";

  const releaseDateFormatted = new Date(movie.releaseDate).toLocaleDateString();
  const trailerUrl = movie.trailerUrl
    ? movie.trailerUrl.startsWith("https://www.youtube.com")
      ? movie.trailerUrl.replace("watch?v=", "embed/")
      : movie.trailerUrl
    : "";

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-600 p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col md:flex-row items-center md:items-start">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-64 h-96 object-cover rounded-lg shadow-lg mb-4 md:mb-0 md:mr-6"
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">{movie.title}</h1>
          <p className="mb-2">{movie.description}</p>
          <p className="text-yellow-600">Release Date: {releaseDateFormatted}</p>
          <p className="text-yellow-600">Rating: {movie.rating || "N/A"}/10</p>
          <p>Duration: {movie.duration || "N/A"} minutes</p>
          <p>Language: {movie.language || "N/A"}</p>
          <p>Genres: {movie.genres?.length ? movie.genres.map((g) => g.name).join(", ") : "N/A"}</p>
          <p>Directors: {movie.directors?.length ? movie.directors.map((d) => d.name).join(", ") : "N/A"}</p>
          {trailerUrl && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Trailer:</h3>
              <iframe
                width="100%"
                height="315"
                src={trailerUrl}
                title="Trailer"
                allowFullScreen
                className="rounded-lg shadow-lg"
              />
            </div>
          )}
          <button
            onClick={handleShowSessions}
            className="mt-6 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded"
          >
            Show Sessions
          </button>
          {showSessions && (
            <div className="mt-6">
              <h2 className="text-xl font-bold">Available Sessions:</h2>
              {sessions && sessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-gray-700 p-4 rounded-lg shadow-lg hover:bg-gray-600 transition-all"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-yellow-500">{new Date(session.startTime).toLocaleString()}</p>
                        <p className="text-yellow-500">{new Date(session.endTime).toLocaleString()}</p>
                      </div>
                      <div className="text-gray-300">
                        <p>Room: {session.roomId}</p>
                        <p>Price: {session.price} UAH</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No available sessions</p>
              )}
              {showBookingButton && (
                <button
                  onClick={handleBookSession}
                  className="mt-4 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded"
                >
                  Book Session
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
