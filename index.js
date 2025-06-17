// index.js
import express from 'express';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// POST /addSchool
app.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Basic validation
  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, parseFloat(latitude), parseFloat(longitude)]
    );

    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// GET /listSchools?lat=23.25&lng=77.42
app.get('/listSchools', async (req, res) => {
  const userLat = parseFloat(req.query.lat);
  const userLng = parseFloat(req.query.lng);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ message: 'Invalid latitude or longitude' });
  }

  try {
    const [schools] = await pool.query('SELECT * FROM schools');

    // Calculate distance using Haversine formula
    const toRadians = degrees => degrees * (Math.PI / 180);
    const earthRadius = 6371; // km

    const sortedSchools = schools.map(school => {
      const dLat = toRadians(school.latitude - userLat);
      const dLng = toRadians(school.longitude - userLng);

      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(userLat)) *
        Math.cos(toRadians(school.latitude)) *
        Math.sin(dLng / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c;

      return { ...school, distance };
    }).sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
