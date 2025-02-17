"use client";

import React from "react";

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
  sessions: Session[];
}

interface Session {
  id: number;
  filmId: number;
  startTime: string;
  endTime: string;
  price: number;
  hall: string;
}

interface MovieDetailsPageState {
  movie: Movie | null;
  isClient: boolean;
  movieId: string | null;
}

class MovieDetailsPage extends React.Component<{}, MovieDetailsPageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      movie: null,
      isClient: false,
      movieId: null,
    };
  }

  componentDidMount() {
    this.setState({ isClient: true });

    const pathSegments = window.location.pathname.split("/");
    const movieId = pathSegments[pathSegments.length - 1];

    if (movieId) {
      this.setState({ movieId }, () => {
        this.fetchMovieDetails(movieId);
      });
    } else {
      console.error("Movie ID not found in the URL");
    }
  }

  fetchMovieDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/movies/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }

      const data = await response.json();
      if (data && data.data) {
        this.setState({ movie: data.data });
      } else {
        console.error("Error: No movie data received");
        this.setState({ movie: null });
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
      this.setState({ movie: null });
    }
  };

  render() {
    const { isClient, movie } = this.state;

    if (!isClient || !movie) return <p>Loading...</p>;

    const posterUrl =
      movie.posterUrl && movie.posterUrl.startsWith("https://")
        ? movie.posterUrl
        : movie.posterUrl
        ? `https://localhost:7000${movie.posterUrl}`
        : "/images/default-image.jpg";

    const trailerUrl = movie.trailerUrl
      ? movie.trailerUrl.startsWith("https://www.youtube.com")
        ? movie.trailerUrl.replace("watch?v=", "embed/")
        : movie.trailerUrl
      : "";

    return (
      <div className="min-h-screen bg-gray-900 text-yellow-600 p-6">
        <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
            {movie.title}
          </h1>
          <img
            src={posterUrl}
            alt={movie.title}
            className="mx-auto mb-4 w-64 h-96 object-cover"
          />

          <p>{movie.description}</p>
          <p className="text-yellow-600">
            Дата випуску: {movie.releaseDate || "N/A"}
          </p>
          <p className="text-yellow-600">Рейтинг: {movie.rating || "N/A"}/10</p>
          <p>Тривалість фільму : {movie.duration || "N/A"} min</p>
          <p>Мова: {movie.language || "N/A"}</p>

          <p>
            Жанр:{" "}
            {movie.genres && movie.genres.length > 0
              ? movie.genres.map((g) => g.name).join(", ")
              : "N/A"}
          </p>

          <p>
            Режисер:{" "}
            {movie.directors && movie.directors.length > 0
              ? movie.directors.map((d) => d.name).join(", ")
              : "N/A"}
          </p>
          {trailerUrl && (
            <div>
              <h3>Трейлер:</h3>
              <iframe
                width="560"
                height="315"
                src={trailerUrl}
                title="Trailer"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MovieDetailsPage;
