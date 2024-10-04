"use client";

import BookingForm from "@/components/BookingForm";

const BookingPage: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Create a New Booking</h1>
      <BookingForm />
    </div>
  );
  
};

export default BookingPage;
