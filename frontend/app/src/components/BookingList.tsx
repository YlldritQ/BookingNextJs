import Link from 'next/link';

interface Booking {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  doctor_name: string;
  service: string;
}

interface BookingListProps {
  bookings: Booking[];
}

function convert24HourTimeTo12HourFormat(timeString) {
  // Split the string into hours and minutes
  if (timeString.includes('AM') || timeString.includes('PM')) {
    return timeString; // Already in 12-hour format
  }

  let [hours, minutes] = timeString.split(':');

  // Convert the string hours into a number
  hours = parseInt(hours, 10);

  // Determine AM or PM suffix
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour time to 12-hour format
  hours = hours % 12 || 12; // Convert '0' (midnight) and '12' noon correctly

  // Return the formatted time string with AM/PM
  return `${hours}:${minutes} ${ampm}`;
}

const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
  return (
    <ul className="space-y-4">
      {bookings.map((booking) => (
        <li key={booking.id} className="p-4 bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg hover:bg-gray-600 transition duration-300 shadow-md">
          <Link
            href={`/booking/${booking.id}`}
            className="block text-lg text-blue-400 font-semibold hover:underline"
          >
            A Booking on <span className="font-medium text-white">{new Date(booking.date).toLocaleDateString()}</span> starting at <span className="font-medium text-white">{convert24HourTimeTo12HourFormat(booking.start_time)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
  
};

export default BookingList;
