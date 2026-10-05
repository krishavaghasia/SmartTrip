/**
 * SmartTrip - Unified Database & Data Access Layer
 * Connects to MySQL pool and falls back gracefully to in-memory store
 * if MySQL server is not yet initialized or password is not yet configured.
 */

const mysql = require('mysql2/promise');
const mockDb = require('./mockDb');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smarttrip_db',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let isConnected = false;

async function initDb() {
  try {
    pool = mysql.createPool(poolConfig);
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    isConnected = true;
    console.log(' [DB] Connected to MySQL database:', poolConfig.database);
    return true;
  } catch (err) {
    isConnected = false;
    console.warn('\n⚠️  [DB] MySQL Notice:');
    console.warn(`   Unable to connect to MySQL database "${poolConfig.database}" (${err.code || err.message}).`);
    console.warn('   Operating with resilient mock data layer for uninterrupted testing & viva prep.');
    console.warn('   To enable live MySQL: verify password in .env and run: npm run setup-db\n');
    return false;
  }
}

function checkConnection() {
  return isConnected;
}

// -------------------------------------------------------------
// UNIFIED DATA ACCESS METHODS
// -------------------------------------------------------------

// Destinations
async function getDestinations() {
  if (isConnected && pool) {
    const [rows] = await pool.query(`
      SELECT d.*, COUNT(p.place_id) AS total_places 
      FROM destinations d
      LEFT JOIN places p ON d.destination_id = p.destination_id
      GROUP BY d.destination_id
      ORDER BY d.name ASC
    `);
    return rows;
  }
  return mockDb.destinations.map(d => ({
    ...d,
    total_places: mockDb.places.filter(p => p.destination_id === d.destination_id).length
  }));
}

async function getDestinationById(id) {
  const destId = parseInt(id, 10);
  if (isConnected && pool) {
    const [rows] = await pool.query('SELECT * FROM destinations WHERE destination_id = ?', [destId]);
    return rows[0] || null;
  }
  return mockDb.destinations.find(d => d.destination_id === destId) || null;
}

// Places
async function getPlaces(filters = {}) {
  const { destination_id, category, max_cost, indoor_outdoor, min_popularity, search } = filters;

  if (isConnected && pool) {
    let sql = 'SELECT * FROM places WHERE 1=1';
    const params = [];

    if (destination_id) {
      sql += ' AND destination_id = ?';
      params.push(parseInt(destination_id, 10));
    }
    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (max_cost !== undefined && max_cost !== '') {
      sql += ' AND cost <= ?';
      params.push(parseFloat(max_cost));
    }
    if (indoor_outdoor && indoor_outdoor !== 'all') {
      sql += ' AND (indoor_outdoor = ? OR indoor_outdoor = "mixed")';
      params.push(indoor_outdoor);
    }
    if (min_popularity !== undefined && min_popularity !== '') {
      sql += ' AND popularity >= ?';
      params.push(parseFloat(min_popularity));
    }
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    sql += ' ORDER BY popularity DESC';
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  // Fallback filter
  return mockDb.places.filter(p => {
    if (destination_id && p.destination_id !== parseInt(destination_id, 10)) return false;
    if (category && category !== 'all' && p.category.toLowerCase() !== category.toLowerCase()) return false;
    if (max_cost !== undefined && max_cost !== '' && p.cost > parseFloat(max_cost)) return false;
    if (indoor_outdoor && indoor_outdoor !== 'all' && p.indoor_outdoor !== indoor_outdoor && p.indoor_outdoor !== 'mixed') return false;
    if (min_popularity !== undefined && min_popularity !== '' && p.popularity < parseFloat(min_popularity)) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    return true;
  });
}

async function getPlaceById(id) {
  const placeId = parseInt(id, 10);
  if (isConnected && pool) {
    const [rows] = await pool.query('SELECT * FROM places WHERE place_id = ?', [placeId]);
    return rows[0] || null;
  }
  return mockDb.places.find(p => p.place_id === placeId) || null;
}

// Users
async function findUserByEmail(email) {
  const normEmail = (email || '').toLowerCase().trim();
  if (isConnected && pool) {
    const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [normEmail]);
    return rows[0] || null;
  }
  return mockDb.users.find(u => u.email.toLowerCase() === normEmail) || null;
}

async function findUserById(id) {
  const userId = parseInt(id, 10);
  if (isConnected && pool) {
    const [rows] = await pool.query('SELECT user_id, name, email, created_at FROM users WHERE user_id = ?', [userId]);
    return rows[0] || null;
  }
  const u = mockDb.users.find(user => user.user_id === userId);
  if (!u) return null;
  return { user_id: u.user_id, name: u.name, email: u.email, created_at: u.created_at };
}

async function createUser({ name, email, password }) {
  if (isConnected && pool) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email.toLowerCase().trim(), password]
    );
    return { user_id: result.insertId, name, email: email.toLowerCase().trim() };
  }

  const newId = mockDb.users.length > 0 ? Math.max(...mockDb.users.map(u => u.user_id)) + 1 : 1;
  const newUser = {
    user_id: newId,
    name,
    email: email.toLowerCase().trim(),
    password,
    created_at: new Date()
  };
  mockDb.users.push(newUser);
  return { user_id: newId, name: newUser.name, email: newUser.email };
}

// Trips
async function createTrip(tripData, preferencesList = [], itineraryList = [], expensesList = []) {
  if (isConnected && pool) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [tripResult] = await connection.query(
        `INSERT INTO trips (user_id, destination_id, title, start_date, end_date, budget, travelers, transport, starting_location, trip_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tripData.user_id,
          tripData.destination_id,
          tripData.title,
          tripData.start_date,
          tripData.end_date,
          tripData.budget,
          tripData.travelers,
          tripData.transport,
          tripData.starting_location || 'Hotel / City Center',
          tripData.trip_score || 85
        ]
      );
      const tripId = tripResult.insertId;

      // Insert Preferences
      for (const pref of preferencesList) {
        await connection.query(
          'INSERT INTO preferences (trip_id, category, weight) VALUES (?, ?, ?)',
          [tripId, pref.category, pref.weight]
        );
      }

      // Insert Itinerary
      for (const item of itineraryList) {
        await connection.query(
          'INSERT INTO itinerary (trip_id, day, place_id, start_time, end_time, sequence, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [tripId, item.day, item.place_id, item.start_time, item.end_time, item.sequence, item.notes || '']
        );
      }

      // Insert Expenses
      for (const exp of expensesList) {
        await connection.query(
          'INSERT INTO expenses (trip_id, category, amount, description) VALUES (?, ?, ?, ?)',
          [tripId, exp.category, exp.amount, exp.description || '']
        );
      }

      await connection.commit();
      return tripId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Fallback in-memory
  const tripId = mockDb.trips.length > 0 ? Math.max(...mockDb.trips.map(t => t.trip_id)) + 1 : 1;
  const newTrip = {
    trip_id: tripId,
    user_id: tripData.user_id,
    destination_id: tripData.destination_id,
    title: tripData.title,
    start_date: tripData.start_date,
    end_date: tripData.end_date,
    budget: parseFloat(tripData.budget),
    travelers: parseInt(tripData.travelers, 10) || 1,
    transport: tripData.transport,
    starting_location: tripData.starting_location || 'Hotel / City Center',
    trip_score: tripData.trip_score || 85,
    created_at: new Date()
  };
  mockDb.trips.push(newTrip);

  preferencesList.forEach((pref, i) => {
    mockDb.preferences.push({
      preference_id: mockDb.preferences.length + 1 + i,
      trip_id: tripId,
      category: pref.category,
      weight: parseFloat(pref.weight)
    });
  });

  itineraryList.forEach((item, i) => {
    mockDb.itinerary.push({
      itinerary_id: mockDb.itinerary.length + 1 + i,
      trip_id: tripId,
      day: item.day,
      place_id: item.place_id,
      start_time: item.start_time,
      end_time: item.end_time,
      sequence: item.sequence,
      notes: item.notes || ''
    });
  });

  expensesList.forEach((exp, i) => {
    mockDb.expenses.push({
      expense_id: mockDb.expenses.length + 1 + i,
      trip_id: tripId,
      category: exp.category,
      amount: parseFloat(exp.amount),
      description: exp.description || ''
    });
  });

  return tripId;
}

async function getTripsByUserId(userId) {
  const uid = parseInt(userId, 10);
  if (isConnected && pool) {
    const [rows] = await pool.query(
      `SELECT t.*, d.name AS destination_name, d.image_url AS destination_image,
              DATEDIFF(t.end_date, t.start_date) + 1 AS duration_days
       FROM trips t
       JOIN destinations d ON t.destination_id = d.destination_id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [uid]
    );
    return rows;
  }

  return mockDb.trips
    .filter(t => t.user_id === uid)
    .map(t => {
      const dest = mockDb.destinations.find(d => d.destination_id === t.destination_id);
      const start = new Date(t.start_date);
      const end = new Date(t.end_date);
      const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return {
        ...t,
        destination_name: dest ? dest.name : 'Unknown Destination',
        destination_image: dest ? dest.image_url : '',
        duration_days: Math.max(days, 1)
      };
    });
}

async function getTripById(tripId) {
  const tid = parseInt(tripId, 10);
  if (isConnected && pool) {
    const [trips] = await pool.query(
      `SELECT t.*, d.name AS destination_name, d.image_url AS destination_image, d.state AS destination_state,
              DATEDIFF(t.end_date, t.start_date) + 1 AS duration_days
       FROM trips t
       JOIN destinations d ON t.destination_id = d.destination_id
       WHERE t.trip_id = ?`,
      [tid]
    );
    if (trips.length === 0) return null;
    const trip = trips[0];

    const [preferences] = await pool.query('SELECT * FROM preferences WHERE trip_id = ?', [tid]);
    const [expenses] = await pool.query('SELECT * FROM expenses WHERE trip_id = ?', [tid]);
    const [itineraryItems] = await pool.query(
      `SELECT i.*, p.name AS place_name, p.category, p.description, p.cost, p.duration, 
              p.popularity, p.latitude, p.longitude, p.opening_time, p.closing_time, 
              p.indoor_outdoor, p.image_url
       FROM itinerary i
       JOIN places p ON i.place_id = p.place_id
       WHERE i.trip_id = ?
       ORDER BY i.day ASC, i.sequence ASC`,
      [tid]
    );

    return {
      ...trip,
      preferences,
      expenses,
      itinerary: itineraryItems
    };
  }

  const trip = mockDb.trips.find(t => t.trip_id === tid);
  if (!trip) return null;
  const dest = mockDb.destinations.find(d => d.destination_id === trip.destination_id);
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const tripPrefs = mockDb.preferences.filter(p => p.trip_id === tid);
  const tripExp = mockDb.expenses.filter(e => e.trip_id === tid);
  const tripItin = mockDb.itinerary
    .filter(i => i.trip_id === tid)
    .sort((a, b) => a.day !== b.day ? a.day - b.day : a.sequence - b.sequence)
    .map(i => {
      const pl = mockDb.places.find(p => p.place_id === i.place_id);
      return {
        ...i,
        place_name: pl ? pl.name : '',
        category: pl ? pl.category : '',
        description: pl ? pl.description : '',
        cost: pl ? pl.cost : 0,
        duration: pl ? pl.duration : 2.0,
        popularity: pl ? pl.popularity : 8.0,
        latitude: pl ? pl.latitude : 0,
        longitude: pl ? pl.longitude : 0,
        opening_time: pl ? pl.opening_time : '09:00:00',
        closing_time: pl ? pl.closing_time : '20:00:00',
        indoor_outdoor: pl ? pl.indoor_outdoor : 'outdoor',
        image_url: pl ? pl.image_url : ''
      };
    });

  return {
    ...trip,
    destination_name: dest ? dest.name : 'Unknown Destination',
    destination_image: dest ? dest.image_url : '',
    destination_state: dest ? dest.state : '',
    duration_days: Math.max(days, 1),
    preferences: tripPrefs,
    expenses: tripExp,
    itinerary: tripItin
  };
}

async function updateTrip(tripId, updateData) {
  const tid = parseInt(tripId, 10);
  if (isConnected && pool) {
    const fields = [];
    const params = [];
    for (const [key, val] of Object.entries(updateData)) {
      fields.push(`${key} = ?`);
      params.push(val);
    }
    params.push(tid);
    await pool.query(`UPDATE trips SET ${fields.join(', ')} WHERE trip_id = ?`, params);
    return true;
  }

  const trip = mockDb.trips.find(t => t.trip_id === tid);
  if (!trip) return false;
  Object.assign(trip, updateData);
  return true;
}

async function deleteTrip(tripId) {
  const tid = parseInt(tripId, 10);
  if (isConnected && pool) {
    await pool.query('DELETE FROM trips WHERE trip_id = ?', [tid]);
    return true;
  }

  const idx = mockDb.trips.findIndex(t => t.trip_id === tid);
  if (idx !== -1) {
    mockDb.trips.splice(idx, 1);
    // Cascade delete preferences, itinerary, expenses
    for (let i = mockDb.preferences.length - 1; i >= 0; i--) {
      if (mockDb.preferences[i].trip_id === tid) mockDb.preferences.splice(i, 1);
    }
    for (let i = mockDb.itinerary.length - 1; i >= 0; i--) {
      if (mockDb.itinerary[i].trip_id === tid) mockDb.itinerary.splice(i, 1);
    }
    for (let i = mockDb.expenses.length - 1; i >= 0; i--) {
      if (mockDb.expenses[i].trip_id === tid) mockDb.expenses.splice(i, 1);
    }
    return true;
  }
  return false;
}

// Itinerary Items
async function addItineraryItem(item) {
  if (isConnected && pool) {
    const [result] = await pool.query(
      'INSERT INTO itinerary (trip_id, day, place_id, start_time, end_time, sequence, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [item.trip_id, item.day, item.place_id, item.start_time, item.end_time, item.sequence, item.notes || '']
    );
    return result.insertId;
  }

  const newId = mockDb.itinerary.length > 0 ? Math.max(...mockDb.itinerary.map(i => i.itinerary_id)) + 1 : 1;
  mockDb.itinerary.push({
    itinerary_id: newId,
    trip_id: parseInt(item.trip_id, 10),
    day: parseInt(item.day, 10),
    place_id: parseInt(item.place_id, 10),
    start_time: item.start_time,
    end_time: item.end_time,
    sequence: parseInt(item.sequence, 10),
    notes: item.notes || ''
  });
  return newId;
}

async function updateItineraryItem(itineraryId, updateData) {
  const iid = parseInt(itineraryId, 10);
  if (isConnected && pool) {
    const fields = [];
    const params = [];
    for (const [key, val] of Object.entries(updateData)) {
      fields.push(`${key} = ?`);
      params.push(val);
    }
    params.push(iid);
    await pool.query(`UPDATE itinerary SET ${fields.join(', ')} WHERE itinerary_id = ?`, params);
    return true;
  }

  const item = mockDb.itinerary.find(i => i.itinerary_id === iid);
  if (!item) return false;
  Object.assign(item, updateData);
  return true;
}

async function deleteItineraryItem(itineraryId) {
  const iid = parseInt(itineraryId, 10);
  if (isConnected && pool) {
    await pool.query('DELETE FROM itinerary WHERE itinerary_id = ?', [iid]);
    return true;
  }

  const idx = mockDb.itinerary.findIndex(i => i.itinerary_id === iid);
  if (idx !== -1) {
    mockDb.itinerary.splice(idx, 1);
    return true;
  }
  return false;
}

// User Dashboard Statistics
async function getUserStats(userId) {
  const uid = parseInt(userId, 10);
  const userTrips = await getTripsByUserId(uid);
  const totalTrips = userTrips.length;

  const now = new Date();
  const upcomingTrips = userTrips.filter(t => new Date(t.start_date) >= now).length;
  
  // Total places in user's itineraries
  let savedPlacesCount = 0;
  if (isConnected && pool) {
    const [res] = await pool.query(
      `SELECT COUNT(DISTINCT place_id) AS cnt FROM itinerary i 
       JOIN trips t ON i.trip_id = t.trip_id 
       WHERE t.user_id = ?`,
      [uid]
    );
    savedPlacesCount = res[0] ? res[0].cnt : 0;
  } else {
    const userTripIds = new Set(userTrips.map(t => t.trip_id));
    const userPlaces = new Set(mockDb.itinerary.filter(i => userTripIds.has(i.trip_id)).map(i => i.place_id));
    savedPlacesCount = userPlaces.size;
  }

  return {
    totalTrips,
    upcomingTrips,
    savedPlaces: savedPlacesCount || (totalTrips * 4) // realistic fallback if new
  };
}

module.exports = {
  initDb,
  checkConnection,
  getDestinations,
  getDestinationById,
  getPlaces,
  getPlaceById,
  findUserByEmail,
  findUserById,
  createUser,
  createTrip,
  getTripsByUserId,
  getTripById,
  updateTrip,
  deleteTrip,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  getUserStats
};
