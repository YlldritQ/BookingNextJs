const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using promise-based API

const app = express();
const port = 5000;

const pool = mysql.createPool({
  host: 'mysql',
  user: 'my_user',
  password: 'my_password',
  database: 'my_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(bodyParser.json());

// API endpoint to fetch bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/bookings/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).send('Booking not found');
    }

    res.status(200).json(rows[0]); 
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    res.status(500).send('Internal Server Error');
  }
});


// API endpoint to insert a booking
app.post('/api/bookings', async (req, res) => {
  const { service, doctor_name, start_time, end_time, date } = req.body;

  const selectedDateTime = new Date(`${date}T${start_time}`);
  const now = new Date();
  if (selectedDateTime < now) {
    return res.status(400).send('Cannot book an appointment in the past.');
  }

  // Check if start time is after end time
  if (start_time >= end_time) {
    return res.status(400).send('Start time must be before end time.');
  }
  // Step 1: Check for existing bookings that conflict with the new booking
  const checkConflictQuery = `
    SELECT * FROM bookings 
    WHERE doctor_name = ? 
    AND date = ? 
    AND (
      (start_time < ? AND end_time > ?) OR 
      (start_time < ? AND end_time > ?)
    )
  `;

  try {
    const [conflictingBookings] = await pool.query(checkConflictQuery, [doctor_name, date, end_time, start_time, start_time, end_time]);

    // Step 2: If conflicts exist, send a conflict response
    if (conflictingBookings.length > 0) {
      return res.status(409).json({ message: 'This time is not available. Please choose another time.' });
    }

    // Step 3: If no conflicts, proceed to insert the booking
    const insertQuery = 'INSERT INTO bookings (service, doctor_name, start_time, end_time, date) VALUES (?, ?, ?, ?, ?)';
    await pool.query(insertQuery, [service, doctor_name, start_time, end_time, date]);

    res.status(201).send('Booking inserted successfully');
  } catch (error) {
    console.error('Error inserting booking:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 