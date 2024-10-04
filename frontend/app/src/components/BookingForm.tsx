"use client"; // This makes the component client-side in Next.js 14

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter
import toast from "react-hot-toast";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    service: '',
    doctor_name: '',
    start_time: '',
    end_time: '',
    date: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state
  const [responseMessage, setResponseMessage] = useState('');
  const router = useRouter(); // Initialize useRouter

  // Limit the date selection to today and future dates
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Working hours
  const workingHoursStart = '09:00'; // 9 AM
  const workingHoursEnd = '20:00'; // 8 PM

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isWithinWorkingHours = (time) => {
    const [hours] = time.split(':').map(Number); // Get the hours from the time string
    return hours >= 9 && hours < 20; // Check if time is between 9 AM and 8 PM
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state to true
    setResponseMessage(''); // Clear any previous messages

    // Check if start time is after end time
    if (formData.start_time >= formData.end_time) {
      setResponseMessage('Start time must be before end time.');
      setIsSubmitting(false);
      return;
    }

    // Check if selected date and start time are in the past
    const selectedDateTime = new Date(`${formData.date}T${formData.start_time}`);
    const now = new Date();
    if (selectedDateTime < now) {
      setResponseMessage('Cannot book an appointment in the past.');
      setIsSubmitting(false);
      return;
    }

    // Check if start time and end time are within working hours
    if (!isWithinWorkingHours(formData.start_time) || !isWithinWorkingHours(formData.end_time)) {
      setResponseMessage('Booking hours are from 9 AM to 8 PM.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://host.docker.internal:5000/api/bookings', formData);
      if (response.status === 201) {
        setResponseMessage('Booking inserted successfully!');
        setFormData({
          service: '',
          doctor_name: '',
          start_time: '',
          end_time: '',
          date: '',
        }); // Clear form
          toast.success("Booking created successfully");
          router.push('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setResponseMessage(error.response.data.message); // Show conflict message
      } else {
        console.error('Error submitting the form:', error);
        setResponseMessage('Failed to insert booking. Please try again.');
      }
    } finally {
      setIsSubmitting(false); // Stop loading state
    }
  };

  const handleCancel = () => {
    router.push('/'); // Redirect to the main page when cancel is clicked
  };
  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Create a Booking</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-gray-300">Service:</span>
          <input
            type="text"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="block w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </label>
  
        <label className="block mb-4">
          <span className="text-gray-300">Doctor Name:</span>
          <input
            type="text"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleChange}
            required
            className="block w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </label>
  
        <label className="block mb-4">
          <span className="text-gray-300">Start Time:</span>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
            min={workingHoursStart}
            max={workingHoursEnd}
            className="block w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </label>
  
        <label className="block mb-4">
          <span className="text-gray-300">End Time:</span>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
            min={workingHoursStart}
            max={workingHoursEnd}
            className="block w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </label>
  
        <label className="block mb-4">
          <span className="text-gray-300">Date:</span>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="block w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            min={today}
          />
        </label>
  
        <button
          type="submit"
          className={`mt-4 w-full px-4 py-2 rounded-md text-white transition duration-300 ${isSubmitting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking'}
        </button>
  
        <button
          type="button"
          onClick={handleCancel}
          className="mt-4 w-full px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-300"
        >
          Cancel
        </button>
  
        {responseMessage && <p className="mt-4 text-center text-red-500">{responseMessage}</p>}
      </form>
    </div>
  );  
};

export default BookingForm;
