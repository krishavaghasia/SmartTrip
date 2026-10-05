-- ====================================================================
-- SmartTrip: Intelligent Travel Itinerary Planner Database Schema
-- Open Source Technologies (OST) Innovative Assignment
-- ====================================================================

CREATE DATABASE IF NOT EXISTS smarttrip_db;
USE smarttrip_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
    destination_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    best_time_to_visit VARCHAR(100)
);

-- 3. Places Table
CREATE TABLE IF NOT EXISTS places (
    place_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    duration DECIMAL(4, 1) DEFAULT 2.0, -- In hours
    popularity DECIMAL(3, 1) DEFAULT 8.0, -- 1.0 to 10.0 scale
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    opening_time TIME DEFAULT '09:00:00',
    closing_time TIME DEFAULT '20:00:00',
    indoor_outdoor ENUM('indoor', 'outdoor', 'mixed') DEFAULT 'outdoor',
    image_url VARCHAR(500),
    CONSTRAINT fk_places_destination FOREIGN KEY (destination_id) 
        REFERENCES destinations(destination_id) ON DELETE CASCADE
);

-- 4. Trips Table
CREATE TABLE IF NOT EXISTS trips (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    travelers INT DEFAULT 1,
    transport VARCHAR(50) DEFAULT 'Public Transport',
    starting_location VARCHAR(150) DEFAULT 'Hotel / City Center',
    trip_score INT DEFAULT 85,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trips_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_trips_destination FOREIGN KEY (destination_id) 
        REFERENCES destinations(destination_id) ON DELETE CASCADE
);

-- 5. User / Group Preferences Table
CREATE TABLE IF NOT EXISTS preferences (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    weight DECIMAL(3, 1) DEFAULT 5.0, -- 1.0 to 10.0
    CONSTRAINT fk_preferences_trip FOREIGN KEY (trip_id) 
        REFERENCES trips(trip_id) ON DELETE CASCADE
);

-- 6. Day-by-Day Itinerary Table
CREATE TABLE IF NOT EXISTS itinerary (
    itinerary_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    day INT NOT NULL,
    place_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    sequence INT NOT NULL,
    notes VARCHAR(255) DEFAULT '',
    CONSTRAINT fk_itinerary_trip FOREIGN KEY (trip_id) 
        REFERENCES trips(trip_id) ON DELETE CASCADE,
    CONSTRAINT fk_itinerary_place FOREIGN KEY (place_id) 
        REFERENCES places(place_id) ON DELETE CASCADE
);

-- 7. Trip Expenses Table (for Budget Optimizer)
CREATE TABLE IF NOT EXISTS expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255) DEFAULT '',
    CONSTRAINT fk_expenses_trip FOREIGN KEY (trip_id) 
        REFERENCES trips(trip_id) ON DELETE CASCADE
);
