"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUserId } from "@/stores/user/selectors";

// Types for movie, session, room, and booking data
interface Movie {
  posterUrl: string;
  title: string;
  description: string;
  releaseDate: string;
  rating?: number;
  duration?: number;
  language?: string;
  genres?: { name: string }[];
  directors?: { name: string }[];
  sessions?: {
    id: number;
    startTime: string;
    endTime: string;
    price: number;
    filmId: number;
    roomId: number;
  }[];
}

interface Session {
  id: number;
  startTime: string;
  endTime: string;
  price: number;
  filmId: number;
  roomId: number;
}

interface Room {
  id: number;
  name: string;
  type: string;
  totalSeats: number;
  rows: number;
  seatsPerRow: number;
}
interface Seat{
  id:number;
  row:number;
  number:number;
  isAvailable:boolean;
  roomId:number;
}

const BookingPage = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [seatingLayout, setSeatingLayout] = useState<Seat[][]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movieId");

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
      fetchSessions(movieId);
    }
  }, [movieId]);

  useEffect(() => {
   

    fetchSeats();
  }, [selectedSession?.id]);
  const fetchSeats = async () => {
    if (selectedSession===null) return;
    try {
      const response = await fetch(`/api/sessions/seats/${selectedSession.id}`);
      const data = await response.json();
      if (room){
        generateSeatingLayout(room, data.data);
      }
   
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setMovie(null);
    }
  };
  // Fetch movie details
  const fetchMovieDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/movies/${id}`);
      const data = await response.json();
      if (data && data.data) {
        setMovie(data.data);
      } else {
        setMovie(null);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setMovie(null);
    }
  };

  // Fetch sessions for the movie
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
        
      } else {
        setSessions([]);
        
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
     
    }
  };

  // Fetch room details
  const fetchRoomDetails = async (roomId: number) => {
    try {
      const response = await fetch(`https://localhost:7000/api/Rooms/${roomId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch room details");
      }
      const data = await response.json();
      if (data && data.data) {
        setRoom(data.data);
       
      } else {
        setRoom(null);
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
      setRoom(null);
    }
  };

  // Generate seating layout
  const generateSeatingLayout = (room:Room, seats:Seat[]) => {
    console.log(seats)
    const layout: Seat[][] = [];
    for (let i = 0; i < room.rows; i++) {
      const row: string[] = [];
    //  for (let j = 0; j < room.seatsPerRow; j++) {
      //  row.push(`seat-${i}+${j}`);
    //  }
      layout.push(seats.slice(room.seatsPerRow*i, room.seatsPerRow*(i + 1)))
    }
    setSeatingLayout(layout);
  };

  // Handle selecting a session
  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
    if (session.roomId) {
      fetchRoomDetails(session.roomId);
    }
  };

  // Handle clicking a seat
  const handleSeatClick = (seatId: string) => {
   
    
    setSelectedSeat(seatId);

    const price = selectedSession ? selectedSession.price : 0;
    setTotalPrice( price);
  };

  // Handle booking
  const userId = useSelector(selectUserId); // Отримання userId із Redux

  const handleBooking = async () => {
    if (selectedSession && selectedSeat) {
      if (!userId) {
        setErrorMessage("You must be logged in to book seats.");
        return;
      }
  
      try {
        const trasactionsresponse = await fetch("/api/trasactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({amount:150}),
        });
        const { data } = await trasactionsresponse.json();
        const bookingData = {
          userId,
          sessionId: selectedSession.id,
          seatId: selectedSeat,
          transactionId: data,
          bookingTime: new Date().toISOString(),
        };
        console.log(bookingData);
       
  
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify(bookingData),
        });
  console.log(await response.json());
  fetchSeats();
  setSelectedSeat(null);
        if (response.ok) {
          alert(`Booking confirmed! You selected 1 seat(s) for session ${selectedSession.id}.`);
        } else {
          throw new Error("Failed to book the seats");
        }
      } catch (error) {
        console.error("Error during booking:", error);
        setErrorMessage("An error occurred while booking. Please try again.");
      }
    } else {
      alert("Please select at least one seat before confirming your booking!");
    }
  };
  
  if (!movie) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-600 p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col md:flex-row items-center md:items-start">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-64 h-96 object-cover rounded-lg shadow-lg mb-4 md:mb-0 md:mr-6"
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">{movie.title}</h1>
          <p className="mb-2">{movie.description}</p>
          <p className="text-yellow-600">Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
          <p className="text-yellow-600">Rating: {movie.rating || "N/A"}/10</p>
          <p>Duration: {movie.duration || "N/A"} minutes</p>
          <p>Language: {movie.language || "N/A"}</p>
          <p>Genres: {movie.genres?.length ? movie.genres.map((g) => g.name).join(", ") : "N/A"}</p>
          <p>Directors: {movie.directors?.length ? movie.directors.map((d) => d.name).join(", ") : "N/A"}</p>

          {sessions.length > 0 ? (
            <ul className="list-none p-0 mt-4">
              {sessions.map((session) => {
                const startTime = new Date(session.startTime);
                const endTime = new Date(session.endTime);
                return (
                  <li
                    key={session.id}
                    className={`bg-gray-700 text-yellow-600 mb-2 p-4 rounded-lg cursor-pointer ${selectedSession?.id === session.id ? "border-2 border-yellow-600" : ""}`}
                    onClick={() => handleSelectSession(session)}
                  >
                    <div className="flex justify-between">
                      <span>{startTime.toLocaleTimeString()} - {endTime.toLocaleTimeString()}</span>
                      <span>Price: ${session.price}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No sessions available.</p>
          )}

          {selectedSession && seatingLayout.length > 0 && (
            <div className="mt-6">
              <div className="text-center mb-6">
                <div className="bg-gray-700 text-white py-2 px-6 rounded-md text-xl font-bold w-2/3 mx-auto">
                  SCREEN
                </div>
              </div>

              <h2 className="text-2xl mb-4 text-yellow-600">Select Your Seat</h2>
              <div className="space-y-4">
                {seatingLayout.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center">
                    <div className="space-x-2">
                      {row.map((seat, seatIndex) => (
                        <span
                          key={seatIndex}
                          className={`bg-gray-700 text-yellow-600 px-4 py-2 rounded-full cursor-pointer ${selectedSeat===seat.id.toString() ? "bg-yellow-600" : ""} ${!seat.isAvailable && "bg-red-600" }`}
                          onClick={() => handleSeatClick(seat.id.toString())}
                        >
                          {seat.number}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleBooking}
            className="mt-6 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded"
          >
            {selectedSeat
              ? `Confirm Booking ($${totalPrice})`
              : "Confirm Booking"}
          </button>

          {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
