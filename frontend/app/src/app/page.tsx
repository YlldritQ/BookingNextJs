"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import BookingList from "../components/BookingList";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface Booking {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  doctor_name: string;
  service: string;
}

// Home component for CSR
const Home: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetching bookings on client-side
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          "http://host.docker.internal:5000/api/bookings",
          { cache: "no-store" }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div
      className={`${inter.className} p-6 max-w-3xl mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-md text-white`}
    >
      <h1
        className={`${inter.className} text-4xl font-bold text-center mb-8 text-white`}
      >
        Bookings
      </h1>

      {loading && (
        <p className="text-center text-gray-400">Loading bookings...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!error && !loading && bookings.length === 0 && (
        <p className="text-center text-gray-400">No bookings available.</p>
      )}
      {!error && !loading && bookings.length > 0 && (
        <BookingList bookings={bookings} />
      )}

      <div className="mt-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">
          Create a New Booking
        </h2>
        <Link href="/booking">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Go to Booking Form
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
