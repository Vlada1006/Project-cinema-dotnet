"use client";

import React, { JSX, useCallback, useEffect, useState } from "react";
import Sidebar from "react-sidebar";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { clearUserStore } from "@/stores/user/user.slice";
import { selectUserEmail, selectUserRoles } from "@/stores/user/selectors";

interface Movie {
  id: string;
  posterUrl: string;
  title: string;
  description: string;
  release_date: string;
  rating: number;
}

const Home = () => {
  const [formattedMovies, setFormattedMovies] = useState<Movie[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const userEmailFromStore = useAppSelector(selectUserEmail);
  const userRolesFromStore = useAppSelector(selectUserRoles);

  const handleMovieClick = (id: string) => {
    router.push(`/movie/${id}`);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log("Requesting films...");
        const response = await fetch("/api/movies");

        const responseBody = await response.json();
        const data = responseBody.data;

        const movies: Movie[] = [];
        for (let i = 0; i < data.length; i++) {
          const movie = data[i];
          console.log(movie);
          movies.push({
            id: movie.id.toString(),
            posterUrl: movie.posterUrl.startsWith("https://")
              ? movie.posterUrl
              : `https://localhost:7000${movie.posterUrl}`,
            title: movie.title,
            description: movie.description,
            release_date: movie.release_date,
            rating: movie.rating,
          });
        }
        setFormattedMovies(movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (!userEmailFromStore) {
      signOut({ redirect: false }).then(() => {
        dispatch(clearUserStore());
      });
    }
  }, [userEmailFromStore]);

  console.log(formattedMovies.map((movie) => movie.posterUrl));
  const addToWatchlist = (id: string) => {
    let exists = false;
    for (let i = 0; i < watchlist.length; i++) {
      if (watchlist[i] === id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      const newWatchlist: string[] = [];
      for (let i = 0; i < watchlist.length; i++) {
        newWatchlist.push(watchlist[i]);
      }
      newWatchlist.push(id);
      setWatchlist(newWatchlist);
    }
  };

  const handleLogoutClick = useCallback(
    () =>
      signOut({ redirect: false }).then(() => {
        dispatch(clearUserStore());

        router.push("/");
      }),
    [dispatch, router]
  );

  const sidebarContent = (
    <div className="p-4 bg-gray-800 text-yellow-600">
      <h3 className="text-xl font-semibold">Функції</h3>
      <ul>
        <li>
          <button
            className="w-full text-left p-2 hover:bg-gray-700 flex items-center justify-start"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
        </li>
        {userEmailFromStore && (
          <li>
            <button
              className="w-full text-left p-2 hover:bg-gray-700"
              onClick={() => router.push("/office")}
            >
              Особистий кабінет
            </button>
          </li>
        )}
        <li>
          <button
            className="w-full text-left p-2 hover:bg-gray-700"
            onClick={() => router.push("/popular")}
          >
            Переглянути популярні фільми
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-2 hover:bg-gray-700"
            onClick={() => router.push("/genres")}
          >
            Фільтрувати за жанром
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-2 hover:bg-gray-700"
            onClick={() => router.push("/director")}
          >
            Пошук за режисером
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-2 hover:bg-gray-700"
            onClick={() => router.push("/sortdate")}
          >
            Сортувати за тривалістю
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-2 hover:bg-gray-700"
            onClick={() => router.push("/showtimes")}
          >
            Переглянути календар показів
          </button>
        </li>
        {userRolesFromStore && userRolesFromStore.includes("Admin") && (
          <li>
            <button
              className="w-full text-left p-2 hover:bg-gray-700"
              onClick={() => router.push("/admin/dashboard")}
            >
              Адмін панель
            </button>
          </li>
        )}
        <li>
          {userEmailFromStore ? (
            <button
              className="w-full text-left p-2 hover:bg-gray-700"
              onClick={() => handleLogoutClick()}
            >
              Вийти
            </button>
          ) : (
            <button
              className="w-full text-left p-2 hover:bg-gray-700"
              onClick={() => router.push("/auth/login")}
            >
              Увійти
            </button>
          )}
        </li>
      </ul>
    </div>
  );

  const movieElements: JSX.Element[] = [];
  for (let i = 0; i < formattedMovies.length; i++) {
    const movie = formattedMovies[i];

    if (!movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
      continue;
    if (selectedGenre && !movie.title.includes(selectedGenre)) continue;
    if (movie.rating < minRating) continue;

    movieElements.push(
      <div
        key={movie.id}
        onClick={() => handleMovieClick(movie.id)}
        className="cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-center"
      >
        <img
          src={movie.posterUrl || "path/to/default-image.jpg"}
          alt={movie.title}
          className="rounded-lg w-56 h-80 object-contain mx-auto"
        />
        <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
      </div>
    );
  }

  return (
    <Sidebar
      sidebar={sidebarContent}
      open={sidebarOpen}
      onSetOpen={setSidebarOpen}
      styles={{ sidebar: { background: "gray" } }}
      pullRight={true}
    >
      <div className="p-6 bg-gray-900 text-yellow-600 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">CinemaHub</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Пошук фільмів..."
              className="w-64 p-2 bg-gray-800 rounded "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-2 bg-gray-700 rounded">🔍</button>
            <button
              className="p-2 bg-gray-900 rounded"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
          </div>
        </header>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Зараз у прокаті</h2>
          <div className="grid grid-cols-3 gap-6">{movieElements}</div>
        </section>
      </div>
    </Sidebar>
  );
};

export default Home;
