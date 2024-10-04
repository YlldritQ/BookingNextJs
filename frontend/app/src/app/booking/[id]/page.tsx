"use client"; // This needs to be at the top to specify this is a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Booking {
  doctor_name: string;
  service: string;
  date: string;
  start_time: string;
  end_time: string;
}

const BookingDetails: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [booking, setBooking] = useState<Booking | null>(null); 
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBooking = async () => {
      const { id } = params; // Access the id from params
      if (!id) return; 

      try {
        const res = await fetch(`http://host.docker.internal:5000/api/bookings/${id}`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Booking not found');
        }
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooking();
  }, [params]); 

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!booking) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-b from-gray-800 to-gray-700 shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-white">Booking Details</h1>
      <p className="mb-4 text-white">
        This booking is with <strong>{booking.doctor_name}</strong> for <strong>{booking.service}</strong> and it ends on <strong>{booking.end_time}</strong>.
      </p>
      <button 
        onClick={() => router.push('/')} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
  
  
  
};

export default BookingDetails;
