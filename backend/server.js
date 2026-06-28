require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const { parse } = require('pg-connection-string'); // Add this line
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const TOTAL_STEPS = 10;

// Middleware
app.use(express.static("public"))
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
// Uses DATABASE_URL environment variable (required for production/Render)
// BULLETPROOF SUPABASE CONNECTION
const config = parse(process.env.DATABASE_URL);

const pool = new Pool({
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.user,
  password: config.password,
  ssl: { rejectUnauthorized: false },
  family: 4 // This will now definitely force IPv4
});

// Helper function to compute the release status based on completed steps
function calculateStatus(stepsCompleted) {
  const completedCount = Array.isArray(stepsCompleted) ? stepsCompleted.length : 0;
  
  if (completedCount === 0) return 'planned';
  if (completedCount >= TOTAL_STEPS) return 'done';
  return 'ongoing';
}

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Get all releases
app.get('/api/releases', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM releases ORDER BY date DESC'
    );

    // Attach computed status to each release before sending to frontend
    const releasesWithStatus = rows.map(release => ({
      ...release,
      status: calculateStatus(release.steps_completed)
    }));

    res.json(releasesWithStatus);
  } catch (err) {
    console.error('Error fetching releases:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Create a new release
app.post('/api/releases', async (req, res) => {
  const { name, date, additional_info } = req.body;

  // Basic validation
  if (!name || !date) {
    return res.status(400).json({ error: 'Name and date are required fields.' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO releases (name, date, additional_info, steps_completed) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, date, additional_info || null, []] // Initialize with empty steps array
    );

    const newRelease = {
      ...rows[0],
      status: 'planned' // New releases always start as planned
    };

    res.status(201).json(newRelease);
  } catch (err) {
    console.error('Error creating release:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Get a specific release (Optional but good practice)
app.get('/api/releases/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM releases WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Release not found' });
    }

    res.json({
      ...rows[0],
      status: calculateStatus(rows[0].steps_completed)
    });
  } catch (err) {
    console.error('Error fetching release:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Update release additional information
app.put('/api/releases/:id', async (req, res) => {
  const { id } = req.params;
  const { additional_info } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE releases 
       SET additional_info = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [additional_info, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Release not found' });
    }

    res.json({
      ...rows[0],
      status: calculateStatus(rows[0].steps_completed)
    });
  } catch (err) {
    console.error('Error updating release info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Toggle a specific step's completion status
app.patch('/api/releases/:id/steps', async (req, res) => {
  const { id } = req.params;
  const { stepNumber } = req.body;

  if (typeof stepNumber !== 'number' || stepNumber < 1 || stepNumber > TOTAL_STEPS) {
    return res.status(400).json({ error: 'Invalid step number.' });
  }

  try {
    // First, fetch the current release to get the existing steps array
    const { rows } = await pool.query('SELECT * FROM releases WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Release not found' });
    }

    let currentSteps = rows[0].steps_completed;
    // Ensure it's an array (PostgreSQL might return it differently in some node-pg versions)
    if (!Array.isArray(currentSteps)) {
      currentSteps = [];
    }

    // Toggle logic: add if missing, remove if present
    const stepIndex = currentSteps.indexOf(stepNumber);
    if (stepIndex > -1) {
      currentSteps.splice(stepIndex, 1); // Uncheck
    } else {
      currentSteps.push(stepNumber);      // Check
      currentSteps.sort((a, b) => a - b); // Keep array sorted for consistency
    }

    // Update the database with the new array
    const { rows: updatedRows } = await pool.query(
      `UPDATE releases 
       SET steps_completed = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [currentSteps, id]
    );

    res.json({
      ...updatedRows[0],
      status: calculateStatus(updatedRows[0].steps_completed)
    });

  } catch (err) {
    console.error('Error toggling step:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});