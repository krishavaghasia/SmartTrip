# 🧭 SmartTrip – Intelligent Travel Itinerary Planner
**Open Source Technologies (OST) Innovative Assignment**  
*Department of Computer Science & Engineering — B.Tech CSE*  
*Repository:* [https://github.com/krishavaghasia/SmartTrip](https://github.com/krishavaghasia/SmartTrip)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/krishavaghasia/SmartTrip)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![jQuery](https://img.shields.io/badge/jQuery-3.7.1-0769AD?logo=jquery&logoColor=white)](https://jquery.com/)

---

## 🌟 1. Project Overview & Concept

**SmartTrip** is an intelligent travel decision-support web application that generates personalized, budget-friendly, and route-optimized day-by-day itineraries. Unlike standard CRUD booking platforms, SmartTrip addresses the real-world dilemmas faced by modern travelers:

- *Where should I go based on my budget?*
- *In what sequence should I visit places to minimize travel transit time?*
- *Can I stay strictly within my budget ceiling?*
- *How do we balance conflicting travel interests when traveling as a group?*
- *What is our backup plan if weather changes or it rains?*

SmartTrip combines **Multi-Factor Recommendation**, **Greedy Nearest-Neighbor Route Optimization (TSP)**, **Dynamic Categorized Budget Allocation**, **Multi-Traveler Preference Consensus**, and an **Alternative Indoor Backup Engine** to produce realistic, actionable trip schedules.

---

## 🛠️ 2. Technology Stack

As per Open Source Technology project guidelines, this application uses **only core open-source web technologies** without heavy modern frontend frameworks (no React, Next.js, Angular, Vue, MongoDB, or Firebase):

| Tier | Technologies Used | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Bootstrap 5.3, JavaScript (ES6+), jQuery 3.7.1, AJAX | Responsive travel UI, custom cards, vertical timeline, progress bars, dynamic asynchronous updates without full-page reload |
| **Backend** | Node.js, Express.js | Modular RESTful API server, routing controllers, custom algorithm modules |
| **Database** | MySQL 8.0 (`mysql2/promise`) | Relational database with foreign key constraints, cascading deletes, transactions, and connection pooling |
| **Security** | `bcryptjs`, `jsonwebtoken` (JWT) | Salted password hashing and secure token-based authentication |

---

## ✨ 3. Key Innovative Features

### 1. Multi-Factor Recommendation Engine
- Scores attractions on a **0.0 to 10.0 scale** based on:
  - **Category Interest Match (40%)**: Aligns with weighted user interests (History, Food, Nature, Adventure, Culture, etc.).
  - **Popularity Index (30%)**: Verified ratings of famous landmarks.
  - **Budget Compatibility (15%)**: Evaluates ticket costs against the user's daily budget ceiling.
  - **Time Compatibility (15%)**: Matches attraction visiting duration (~1.5 to 3 hrs) with available day hours.
- Returns transparent, human-readable explanations (e.g. *“⭐ 9.5/10 Match • Matches your Food preference • Free admission (100% budget friendly)”*).

### 2. Route Optimization (Nearest Neighbor TSP)
- Uses the **Great-Circle Haversine Formula** to compute real geographic distance between latitude/longitude coordinates on Earth.
- Implements the **Greedy Nearest Neighbor Heuristic** to order attractions sequentially each day starting from the base hotel/origin.
- Eliminates unnecessary crisscrossing, displaying total travel distance (km), estimated transit time, and step-by-step transit legs based on transport speed (Walking, Public Transit, Car, Bike, Taxi).

### 3. Budget Optimizer & Smart Saving Suggestions
- Automatically estimates categorized expenses:
  - **Transportation**: Mode-dependent daily rates across travelers.
  - **Accommodation**: Budget-scaled hotel rate calculation per room.
  - **Food & Dining**: Standard per-day meals per traveler.
  - **Activities & Entry**: Sum of ticket entry fees per attraction.
  - **Miscellaneous**: Emergency and souvenir reserve buffer (~5%).
- Features a **Utilization Progress Bar** and **Overbudget Warning**.
- If over budget, the engine automatically identifies the most expensive attraction and suggests lower-cost or free alternatives in the same city (e.g. *“Replace Activity A (₹700) with Activity B (₹0) — Estimated Saving: ₹700”*).

### 4. Group Travel Preference System
- Allows multiple group members (Traveler 1, Traveler 2, Traveler 3) to submit their independent interests.
- The backend normalizes and calculates a **Group Consensus Preference Vector**, ensuring everyone’s top choices are included in the generated plan.

### 5. Rainy Day / Alternative Itinerary Planner
- A dedicated **“☔ Generate Alternative Plan (Rainy Day)”** button dynamically swaps outdoor walking tours and open lakes with indoor museums, science complexes, galleries, and covered bazaars using the database's `indoor_outdoor` classification.

### 6. 4-Pillar Trip Feasibility Scorer (0–100)
- Quantifies trip quality across four essential dimensions:
  1. **Budget Efficiency (25 pts)**: Financial feasibility and spending buffer.
  2. **Preference Match (25 pts)**: Interest alignment of chosen places.
  3. **Route Efficiency (25 pts)**: Compactness of daily travel routes.
  4. **Time Utilization (25 pts)**: Balanced pacing between activities and rest intervals.
- Generates actionable **Smart Suggestions** (e.g., free time windows, travel tips).

### 7. Interactive Vertical Timeline & CRUD Management
- Visually attractive vertical timeline with time badges (09:00 AM, 11:30 AM, 02:30 PM, etc.).
- Users can **Move Up / Move Down** activities, **Edit visiting times and notes**, **Delete activities**, or **Add new attractions** via AJAX modals without refreshing the page.

---

## 📐 4. System Architecture & Workflow

```text
User Input / Group Preferences (Web UI)
                 │
                 ▼
          jQuery AJAX Call
                 │
                 ▼
      Express.js Backend Server
                 │
        ┌────────┴──────────────────────────┐
        ▼                                   ▼
Database Query (MySQL 8.0)       Intelligence Algorithms
(Destinations & Places)          ├── 1. Recommendation Engine (Scoring)
        │                        ├── 2. Route Optimizer (Haversine + Nearest Neighbor)
        │                        ├── 3. Budget Optimizer (Categorization & Savings)
        │                        ├── 4. Group Consensus Vector
        │                        └── 5. 4-Pillar Trip Scorer
        └────────┬──────────────────────────┘
                 │
                 ▼
        Optimized Day-by-Day Plan
                 │
                 ▼
      Interactive Vertical Timeline (Bootstrap 5 + AJAX)
```

---

## 🗄️ 5. Database Schema (MySQL)

The project includes clean DDL in [`database/schema.sql`](database/schema.sql) and rich demo seed data in [`database/seed.sql`](database/seed.sql).

### Tables:
1. **`users`**: User registration, hashed credentials (`bcryptjs`), and timestamps.
2. **`destinations`**: Predefined Indian travel cities (Ahmedabad, Mumbai, Jaipur, Delhi, Goa, Udaipur, Manali).
3. **`places`**: 70+ attractions with category, cost, duration, popularity rating, latitude, longitude, opening/closing times, and `indoor_outdoor` status.
4. **`trips`**: Saved itineraries with destination, start/end dates, budget, travelers count, transport mode, and trip score.
5. **`preferences`**: Category weights associated with a trip.
6. **`itinerary`**: Day-by-day scheduled activities linking trip, place, start time, end time, and sequence order.
7. **`expenses`**: Categorized expense breakdown per trip.

```sql
-- Core Table Relations
users (user_id) ────< trips (trip_id) ────< itinerary (itinerary_id) >──── places (place_id)
                         │
                         ├──< preferences (preference_id)
                         └──< expenses (expense_id)
destinations (destination_id) ────< places (place_id)
```

---

## 🔬 6. Core Algorithms & Mathematical Formulations

### Algorithm 1: Haversine Great-Circle Distance
Used in `server/algorithms/routeOptimizer.js` to compute distance $d$ in kilometers between two GPS coordinates $(\phi_1, \lambda_1)$ and $(\phi_2, \lambda_2)$:

$$\Delta\phi = \phi_2 - \phi_1, \quad \Delta\lambda = \lambda_2 - \lambda_1$$
$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1 \cos\phi_2 \sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
$$d = R \cdot c \quad (\text{where } R = 6371\text{ km})$$

### Algorithm 2: Nearest-Neighbor TSP Heuristic
```javascript
// Pseudocode for ordering Day Attractions:
Let Unvisited = [Place_1, Place_2, ..., Place_N]
Let Current = Starting_Location (Hotel)
Let OrderedRoute = []

While Unvisited is not empty:
    Find Place_i in Unvisited with minimum HaversineDistance(Current, Place_i)
    Append Place_i to OrderedRoute
    Remove Place_i from Unvisited
    Current = Place_i
Return OrderedRoute
```

### Algorithm 3: Multi-Factor Recommendation Score
$$\text{Score} = \left(\frac{W_{\text{interest}}}{10} \times 4.0\right) + \left(\frac{P_{\text{rating}}}{10} \times 3.0\right) + S_{\text{budget}} + S_{\text{time}}$$
- $W_{\text{interest}}$: User's priority weight (1–10).
- $P_{\text{rating}}$: Attraction popularity index (1–10).
- $S_{\text{budget}}$: Budget compatibility score (up to 1.5 pts).
- $S_{\text{time}}$: Visiting duration fit score (up to 1.5 pts).
- Normalized to a $1.0 - 10.0$ match score.

---

## 🚀 7. Installation & Setup Guide

### Prerequisites
1. **Node.js** (v16.0 or higher) — [Download Node.js](https://nodejs.org/)
2. **Git** — [Download Git](https://git-scm.com/)
3. **MySQL Server** (v8.0 or XAMPP / WAMP)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/krishavaghasia/SmartTrip.git
cd SmartTrip
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Database Credentials
Create or edit the `.env` file in the root folder:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smarttrip_db
JWT_SECRET=smarttrip_secret_key_btech_cse_2026
```

### Step 4: Run Automated Database Setup
Run the automated migration and seed script:
```bash
npm run setup-db
```
*This command connects to MySQL, creates the `smarttrip_db` database, sets up all 7 relational tables, and inserts realistic data for **Ahmedabad, Mumbai, Jaipur, Delhi, Goa, Udaipur, and Manali** (70+ places).*

> **💡 Resilient Architecture:** If MySQL is not running or the password is still being configured, SmartTrip seamlessly falls back to an internal in-memory store so the server **never crashes**, allowing uninterrupted testing & viva evaluation!

### Step 5: Start the Web Server
```bash
npm start
```

### Step 6: Open in Browser
Open your browser to:
```
http://localhost:3000
```

---

## 🌐 8. REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/register` | Register new user account |
| `POST` | `/api/login` | Authenticate user & return JWT token |
| `GET` | `/api/destinations` | List all 7 travel cities with place counts |
| `GET` | `/api/destinations/:id` | Get destination details and its attractions |
| `GET` | `/api/places` | Filter attractions by destination, category, price, indoor/outdoor |
| `POST` | `/api/generate-itinerary`| Core intelligent itinerary generation |
| `POST` | `/api/optimize-route` | Run Nearest-Neighbor TSP optimization |
| `POST` | `/api/group-preferences`| Calculate group consensus preference vector |
| `POST` | `/api/budget-optimize` | Calculate budget breakdown and cost-saving suggestions |
| `GET` | `/api/recommendations` | Get scored recommendation list for a city |
| `POST` | `/api/trips` | Save customized trip to database |
| `GET` | `/api/trips` | Retrieve user's saved trips |
| `GET` | `/api/trips/:id` | Retrieve full trip details with day-by-day itinerary |
| `DELETE`| `/api/trips/:id` | Delete saved trip and its itinerary items |
| `POST` | `/api/itinerary` | Add attraction to a specific day |
| `PUT` | `/api/itinerary/:id` | Update activity time or notes |
| `DELETE`| `/api/itinerary/:id` | Remove activity from day |
| `GET` | `/api/health` | Live diagnostic status of server, MySQL, and loaded data |

---

## 🎓 9. Viva Voce & Demonstration Guide

### Key Viva Questions & Answers:

**Q1: Why is SmartTrip not just a simple CRUD website?**
> *"A normal travel site simply performs Create, Read, Update, Delete operations on bookings. SmartTrip is an Intelligent Decision-Support System: it takes user constraints (budget, dates, interests, transport), scores candidate places using a multi-factor recommendation engine, optimizes the geographic visit sequence using Nearest Neighbor TSP, ensures budget adherence with smart replacement suggestions, and generates rainy-day backup alternatives."*

**Q2: What algorithm did you use for route optimization and why?**
> *"We implemented the Greedy Nearest Neighbor heuristic using the Great-Circle Haversine formula to compute geodesic distances between latitude/longitude points. The Traveling Salesperson Problem (TSP) is NP-hard ($O(n!)$ brute-force). For daytime travel with 3–6 stops, Nearest Neighbor runs in $O(n^2)$ time, providing a fast, realistic route order that avoids backtracking."*

**Q3: How does the Group Travel Preference algorithm work?**
> *"Each traveler selects their preferred categories. Our algorithm aggregates the selections, weights them based on member consensus, and normalizes them onto a 1–10 scale. Popular group choices receive higher priority scores while still preserving variety."*

**Q4: How does the Rainy Day feature function?**
> *"Every attraction in our MySQL `places` table has an `indoor_outdoor` ENUM column ('indoor', 'outdoor', 'mixed'). When the user clicks 'Generate Alternative Plan (Rainy Day)', the backend filters for indoor monuments, galleries, and covered complexes, recalculates routes and budgets, and provides an immediate backup plan."*

---

## 👨‍💻 Author

* **Krishna Vaghasia** ([@krishavaghasia](https://github.com/krishavaghasia))  
* *B.Tech Computer Science & Engineering*  
* *Open Source Technologies (OST) Innovative Project*

---

**© 2026 SmartTrip Planner • MIT License**