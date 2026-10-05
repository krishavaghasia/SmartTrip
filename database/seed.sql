-- ====================================================================
-- SmartTrip: Sample Data Seed Script
-- Realistic places across 7 top Indian travel destinations
-- ====================================================================

USE smarttrip_db;

-- 1. Demo User (Password: "password123", bcrypt hashed)
-- Hash generated using bcryptjs: $2a$10$wT8K8U1yZ1K6lXlHwP0qIuP4m2Z3C7oJ2R5w9W7B4oM1q8Z9C8G2G
INSERT INTO users (user_id, name, email, password) VALUES
(1, 'Demo Explorer', 'demo@smarttrip.com', '$2a$10$3euP0v8kK3mK6H2g.K4T4eUv8p0EfZ.n6qP0Fwz2eB6C3gW5F6q4u')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Destinations
INSERT INTO destinations (destination_id, name, state, description, image_url, best_time_to_visit) VALUES
(1, 'Ahmedabad', 'Gujarat', 'India''s first UNESCO World Heritage City, famous for serene ashrams, intricate stepwells, rich textiles, and legendary night food markets.', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', 'October to March'),
(2, 'Mumbai', 'Maharashtra', 'The dazzling City of Dreams with colonial architecture, bustling promenades, heritage caves, vibrant markets, and sea views.', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80', 'November to February'),
(3, 'Jaipur', 'Rajasthan', 'The iconic Pink City celebrated for majestic Rajput fortresses, ornate royal palaces, vibrant bazaars, and opulent culture.', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', 'October to March'),
(4, 'Delhi', 'Delhi NCR', 'India''s historic capital combining centuries of Mughal splendour, grand monuments, bustling Chandni Chowk lanes, and top museums.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', 'October to March'),
(5, 'Goa', 'Goa', 'Sun-kissed beaches, coastal Portuguese churches, water adventure sports, spice plantations, and lively seaside nightlife.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', 'November to March'),
(6, 'Udaipur', 'Rajasthan', 'The romantic City of Lakes boasting shimmering waters, magnificent marble palaces, art galleries, and serene sunset points.', 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80', 'September to March'),
(7, 'Manali', 'Himachal Pradesh', 'Breathtaking Himalayan valley destination featuring snow-capped peaks, alpine pine forests, river rafting, and cozy mountain cafes.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', 'Year-round (Snow: Dec-Feb)');

-- 3. Places Seed Data

-- -------------------------------------------------------------
-- DESTINATION 1: AHMEDABAD (10 Places)
-- -------------------------------------------------------------
INSERT INTO places (destination_id, name, category, description, cost, duration, popularity, latitude, longitude, opening_time, closing_time, indoor_outdoor, image_url) VALUES
(1, 'Sabarmati Ashram', 'History', 'Mahatma Gandhi''s tranquil riverside headquarters from 1917 to 1930 with personal artifacts, museum gallery, and library.', 0.00, 2.0, 9.6, 23.0605, 72.5800, '08:30:00', '18:30:00', 'mixed', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80'),
(1, 'Adalaj Stepwell', 'Culture', 'Magnificent 15th-century five-story subterranean architectural marvel with intricate Hindu and Solanki carvings.', 50.00, 1.5, 9.4, 23.1667, 72.5804, '08:00:00', '18:00:00', 'indoor', 'https://images.unsplash.com/photo-1599831104328-5696144e59df?auto=format&fit=crop&w=600&q=80'),
(1, 'Manek Chowk Night Food Market', 'Food', 'Historic city square buzzing at night with legendary street delicacies like chocolate sandwiches, pav bhaji, and kulfi.', 250.00, 2.0, 9.5, 23.0248, 72.5890, '19:30:00', '23:59:00', 'outdoor', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'),
(1, 'Sabarmati Riverfront Walk', 'Nature', 'Serene landscaped promenade along the Sabarmati river with lush gardens, cycling tracks, and sunset vantage points.', 30.00, 2.0, 9.1, 23.0370, 72.5714, '09:00:00', '21:00:00', 'outdoor', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'),
(1, 'Sidi Saiyyed Mosque', 'History', 'Famed 16th-century mosque world-renowned for its delicately carved marble stone lattice window, the Tree of Life.', 0.00, 1.0, 9.2, 23.0270, 72.5815, '07:00:00', '19:00:00', 'indoor', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'),
(1, 'Calico Museum of Textiles', 'Culture', 'Premier textile museum showcasing historic Indian fabrics, royal court costumes, and Mughal miniature tapestries.', 100.00, 2.5, 8.9, 23.0560, 72.5930, '10:30:00', '13:00:00', 'indoor', 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80'),
(1, 'Kankaria Lake & Entertainment Hub', 'Relaxation', 'Iconic 15th-century polygonal lake offering toy train rides, balloon safari, peaceful lake walks, and zoo.', 50.00, 2.5, 9.0, 22.9983, 72.6030, '09:00:00', '22:00:00', 'outdoor', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'),
(1, 'Old City Heritage Walk', 'Photography', 'Guided morning journey through historic pols, wooden havelis, secret passageways, and bird feeders.', 150.00, 2.5, 9.3, 23.0260, 72.5900, '07:30:00', '10:30:00', 'outdoor', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80'),
(1, 'Law Garden Traditional Night Market', 'Shopping', 'Lively market famous for authentic Kutchi embroidered kurtas, chaniya cholis, antique jewelry, and snacks.', 400.00, 2.0, 8.8, 23.0267, 72.5601, '17:00:00', '22:30:00', 'outdoor', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80'),
(1, 'Science City IMAX & Robotics Gallery', 'Adventure', 'Massive science complex featuring humanoid robotics, planetarium, aquatic gallery, and interactive IMAX theater.', 350.00, 3.0, 9.2, 23.0784, 72.4975, '10:00:00', '20:00:00', 'indoor', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80');

-- -------------------------------------------------------------
-- DESTINATION 2: MUMBAI (10 Places)
-- -------------------------------------------------------------
INSERT INTO places (destination_id, name, category, description, cost, duration, popularity, latitude, longitude, opening_time, closing_time, indoor_outdoor, image_url) VALUES
(2, 'Gateway of India', 'History', 'Majestic basalt arch overlooking the Arabian Sea built in 1924 to commemorate King George V''s visit.', 0.00, 1.5, 9.8, 18.9220, 72.8347, '06:00:00', '23:00:00', 'outdoor', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80'),
(2, 'Elephanta Caves Ferry & Tour', 'Culture', 'UNESCO World Heritage rock-cut cave temples dedicated to Lord Shiva situated on an island in Mumbai harbour.', 260.00, 4.0, 9.3, 18.9633, 72.9315, '09:00:00', '17:30:00', 'mixed', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'),
(2, 'Marine Drive & Queens Necklace', 'Relaxation', 'Sweeping 3.6-kilometer seaside promenade offering breezy sea walks, sunset views, and iconic street life.', 0.00, 2.0, 9.7, 18.9432, 72.8230, '06:00:00', '23:59:00', 'outdoor', 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80'),
(2, 'Chhatrapati Shivaji Maharaj Vastu Museum', 'History', 'Premier art and history museum housed in grand Indo-Saracenic building with over 50,000 rare exhibits.', 150.00, 2.5, 9.1, 18.9268, 72.8327, '10:15:00', '18:00:00', 'indoor', 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80'),
(2, 'Colaba Causeway Shopping & Cafes', 'Shopping', 'Buzzing street market famous for antique curios, boho fashion, brass knick-knacks, and historic Leopold Cafe.', 300.00, 2.5, 9.0, 18.9195, 72.8315, '10:00:00', '22:00:00', 'mixed', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80'),
(2, 'Girgaon Chowpatty Street Feast', 'Food', 'Iconic sandy beach renowned for Mumbai street snacks: bhelpuri, sev puri, pav bhaji, and badam kulfi.', 200.00, 1.5, 9.2, 18.9548, 72.8143, '16:00:00', '23:30:00', 'outdoor', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'),
(2, 'Sanjay Gandhi National Park & Kanheri Caves', 'Adventure', 'Sprawling metropolitan nature park with ancient Buddhist rock-cut caves, cycling trails, and deer safari.', 120.00, 3.5, 8.8, 19.2288, 72.9182, '07:30:00', '18:00:00', 'outdoor', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'),
(2, 'Bandra Bandstand & Sea Link Vista', 'Photography', 'Chic coastal strip with celebrity homes, amphitheatre, rocky shores, and breathtaking views of the Bandra-Worli Sea Link.', 0.00, 1.5, 8.9, 19.0434, 72.8197, '06:00:00', '23:00:00', 'outdoor', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80'),
(2, 'Haji Ali Dargah', 'Religious', 'Historic Indo-Islamic shrine and mosque perched on an islet in the Arabian Sea accessible by a narrow tidal causeway.', 0.00, 1.5, 9.3, 18.9774, 72.8111, '06:00:00', '21:30:00', 'mixed', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80'),
(2, 'Lower Parel Nightlife & Microbreweries', 'Nightlife', 'Transformed mill district boasting cutting-edge rooftop lounges, craft breweries, and trendy dining experiences.', 800.00, 3.0, 9.1, 18.9950, 72.8258, '18:00:00', '23:59:00', 'indoor', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80');

-- -------------------------------------------------------------
-- DESTINATION 3: JAIPUR (10 Places)
-- -------------------------------------------------------------
INSERT INTO places (destination_id, name, category, description, cost, duration, popularity, latitude, longitude, opening_time, closing_time, indoor_outdoor, image_url) VALUES
(3, 'Amber Fort & Palace', 'History', 'Grand hilltop fort featuring majestic Rajput architecture, Sheesh Mahal (Mirror Palace), and Maota Lake views.', 200.00, 3.0, 9.8, 26.9855, 75.8513, '08:00:00', '18:00:00', 'mixed', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'),
(3, 'Hawa Mahal (Palace of Winds)', 'Photography', 'Iconic five-story pink sandstone palace with 953 ornate latticed windows designed for royal women.', 50.00, 1.5, 9.7, 26.9239, 75.8267, '09:00:00', '17:00:00', 'mixed', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'),
(3, 'City Palace Complex', 'Culture', 'Magnificent royal residence combining Mughal and Rajput styles with museum galleries and royal courtyards.', 300.00, 2.5, 9.4, 26.9258, 75.8237, '09:30:00', '17:00:00', 'mixed', 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80'),
(3, 'Jantar Mantar Astronomical Observatory', 'History', 'UNESCO World Heritage 18th-century stone astronomical instruments including the world''s largest stone sundial.', 100.00, 1.5, 9.1, 26.9248, 75.8246, '09:00:00', '17:00:00', 'outdoor', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'),
(3, 'Nahargarh Fort Sunset Viewpoint', 'Adventure', 'Fortress perched on the edge of the Aravalli Hills offering sweeping panoramic views of the pink city.', 100.00, 2.5, 9.5, 26.9372, 75.8156, '10:00:00', '21:00:00', 'outdoor', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'),
(3, 'Johari Bazaar & Bapu Bazaar', 'Shopping', 'Colorful traditional markets renowned for gemstone jewelry, Jaipuri quilts, leather juttis, and block prints.', 350.00, 2.5, 9.0, 26.9197, 75.8265, '10:30:00', '20:30:00', 'outdoor', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80'),
(3, 'Albert Hall Central Museum', 'Culture', 'Oldest museum in Rajasthan displaying rare paintings, Persian carpets, Egyptian mummy, and metal crafts.', 150.00, 2.0, 8.8, 26.9116, 75.8195, '09:00:00', '17:00:00', 'indoor', 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80'),
(3, 'Chokhi Dhani Ethnic Village Resort', 'Food', 'Immersive Rajasthani cultural village with traditional folk dance, puppet shows, camel rides, and royal thali.', 700.00, 3.5, 9.4, 26.7663, 75.8361, '17:30:00', '23:00:00', 'mixed', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'),
(3, 'Govind Dev Ji Temple', 'Religious', 'Venerable Vaishnavite temple inside City Palace grounds buzzing with devotional songs and royal aartis.', 0.00, 1.0, 9.2, 26.9290, 75.8240, '05:00:00', '20:30:00', 'indoor', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80'),
(3, 'Jal Mahal Lake Pavilion', 'Relaxation', 'Picturesque 18th-century palace resting in the middle of Man Sagar Lake, surrounded by the Aravalli hills.', 0.00, 1.0, 9.3, 26.9535, 75.8462, '06:00:00', '22:00:00', 'outdoor', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80');

-- -------------------------------------------------------------
-- DESTINATION 4: DELHI (10 Places)
-- -------------------------------------------------------------
INSERT INTO places (destination_id, name, category, description, cost, duration, popularity, latitude, longitude, opening_time, closing_time, indoor_outdoor, image_url) VALUES
(4, 'Qutub Minar Complex', 'History', '73-meter soaring minaret built in 1192 surrounded by ancient ruins, Iron Pillar, and intricate carvings.', 50.00, 2.0, 9.6, 28.5245, 77.1855, '07:00:00', '18:00:00', 'outdoor', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80'),
(4, 'Humayun''s Tomb', 'History', 'Splendid garden tomb of Mughal Emperor Humayun, inspiration for the Taj Mahal, set within charbagh gardens.', 50.00, 2.0, 9.5, 28.5933, 77.2507, '06:00:00', '18:00:00', 'outdoor', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'),
(4, 'National Museum of India', 'Culture', 'Premier cultural museum housing 200,000 works of art spanning 5,000 years from Indus Valley to modern era.', 50.00, 3.0, 9.2, 28.6118, 77.2193, '10:00:00', '18:00:00', 'indoor', 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80'),
(4, 'Chandni Chowk & Paranthe Wali Gali', 'Food', 'Legendary 17th-century bustling food lane serving stuffed deep-fried paranthas, jalebis, and sweet lassi.', 200.00, 2.5, 9.7, 28.6562, 77.2301, '09:00:00', '22:00:00', 'outdoor', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'),
(4, 'Lotus Temple (Bahá''í House of Worship)', 'Relaxation', 'Iconic flower-shaped marble temple welcoming all religions for peaceful silent meditation and reflection.', 0.00, 1.5, 9.4, 28.5535, 77.2588, '09:00:00', '17:30:00', 'indoor', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80'),
(4, 'India Gate & Kartavya Path', 'Photography', 'War memorial arch honoring soldiers, flanked by lush manicured lawns, fountains, and vibrant evening lighting.', 0.00, 1.5, 9.6, 28.6129, 77.2295, '06:00:00', '23:00:00', 'outdoor', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80'),
(4, 'Dilli Haat Crafts Market', 'Shopping', 'Open-air food plaza and craft bazaar showcasing authentic handicrafts and regional foods from all Indian states.', 50.00, 2.5, 9.1, 28.5732, 77.2078, '10:30:00', '22:00:00', 'outdoor', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80'),
(4, 'Akshardham Temple Complex', 'Religious', 'Colossal spiritual complex featuring sculpted mandirs, musical fountain show, garden exhibitions, and boat ride.', 250.00, 3.5, 9.6, 28.6127, 77.2773, '09:30:00', '19:30:00', 'mixed', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80'),
(4, 'Lodhi Art District & Lodhi Gardens', 'Nature', 'Serene Mughal tomb gardens adjacent to India''s first open-air public street art district with giant murals.', 0.00, 2.0, 9.0, 28.5898, 77.2209, '06:00:00', '20:00:00', 'outdoor', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'),
(4, 'Hauz Khas Village Cafes & Fort', 'Nightlife', 'Trendy neighborhood combining medieval 13th-century reservoir ruins with indie fashion boutiques and chic bars.', 600.00, 3.0, 9.0, 28.5539, 77.1942, '11:00:00', '23:59:00', 'mixed', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80');

-- -------------------------------------------------------------
-- DESTINATION 5: GOA (10 Places)
-- -------------------------------------------------------------
INSERT INTO places (destination_id, name, category, description, cost, duration, popularity, latitude, longitude, opening_time, closing_time, indoor_outdoor, image_url) VALUES
(5, 'Calangute & Baga Beach', 'Adventure', 'The heart of North Goa watersports: parasailing, jet skiing, banana boat rides, and lively beach shacks.', 400.00, 3.5, 9.6, 15.5439, 73.7553, '06:00:00', '22:00:00', 'outdoor', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80'),
(5, 'Basilica of Bom Jesus', 'History', 'UNESCO World Heritage 16th-century baroque church holding the sacred mortal remains of St. Francis Xavier.', 0.00, 1.5, 9.4, 15.5009, 73.9116, '09:00:00', '18:30:00', 'indoor', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'),
(5, 'Fontainhas Latin Quarter Walk', 'Photography', 'Charming historic Portuguese quarter with colorful pastel villas, ornate wooden balconies, and heritage art cafes.', 0.00, 2.0, 9.3, 15.4989, 73.8322, '07:00:00', '19:00:00', 'outdoor', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80'),
(5, 'Fort Aguada & Lighthouse', 'History', '17th-century Portuguese fortress overlooking Sinquerim Beach, offering ocean panoramas and historic water reservoir.', 50.00, 2.0, 9.2, 15.4925, 73.7736, '09:30:00', '17:30:00', 'outdoor', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'),
(5, 'Dudhsagar Waterfalls Trek', 'Nature', 'Majestic four-tiered waterfall cascading down 310 meters on the Mandovi River through lush Bhagwan Mahavir Sanctuary.', 500.00, 5.0, 9.5, 15.3144, 74.3143, '07:00:00', '16:00:00', 'outdoor', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'),
(5, 'Anjuna Flea Market', 'Shopping', 'Famous beachfront bazaar packed with bohemian clothes, handmade jewelry, musical instruments, and crafts.', 200.00, 2.5, 8.9, 15.5786, 73.7423, '09:00:00', '18:00:00', 'outdoor', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80'),
(5, 'Goan Spice Plantation Tour & Traditional Lunch', 'Food', 'Guided aromatic walk through pepper, vanilla, and cardamom plantations followed by traditional Goan fish curry buffet.', 450.00, 3.0, 9.1, 15.4371, 74.0205, '10:00:00', '16:00:00', 'mixed', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'),
(5, 'Tito''s Lane Nightlife & Beach Clubs', 'Nightlife', 'Electrifying nightlife strip in Baga packed with world-famous clubs, DJ sets, dance floors, and cocktails.', 800.00, 4.0, 9.3, 15.5539, 73.7540, '19:00:00', '23:59:00', 'indoor', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'),
(5, 'Palolem Beach Relaxation', 'Relaxation', 'Pristine crescent bay in South Goa with calm turquoise waters, colorful wooden beach huts, and gentle kayaking.', 0.00, 3.0, 9.5, 15.0100, 74.0232, '06:00:00', '22:00:00', 'outdoor', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'),
(5, 'Goa Chitra Museum', 'Culture', 'Ecological museum displaying over 4,000 traditional indigenous Goan agricultural and agrarian artifacts.', 150.00, 2.0, 8.6, 15.2630, 73.9480, '09:00:00', '18:00:00', 'indoor', 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80');

-- -------------------------------------------------------------
-- DESTINATION 6: UDAIPUR (10 Places)
-- -------------------------------------------------------------
INSERT INTO places (destination_id, name, category, description, cost, duration, popularity, latitude, longitude, opening_time, closing_time, indoor_outdoor, image_url) VALUES
(6, 'City Palace of Udaipur', 'History', 'Grand lakeside royal palace complex boasting intricate mirror work, marble courtyards, and museum galleries.', 300.00, 3.0, 9.8, 24.5764, 73.6835, '09:00:00', '17:30:00', 'indoor', 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80'),
(6, 'Lake Pichola Sunset Boat Cruise', 'Relaxation', 'Iconic evening cruise gliding past the floating Lake Palace, Jag Mandir island, and illuminated city skyline.', 450.00, 1.5, 9.7, 24.5732, 73.6782, '09:00:00', '18:00:00', 'outdoor', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'),
(6, 'Jagdish Temple', 'Religious', 'Magnificent 1651 Hindu temple dedicated to Lord Vishnu featuring ornate pillars, spire, and stone elephant carvings.', 0.00, 1.0, 9.0, 24.5795, 73.6842, '05:30:00', '21:00:00', 'indoor', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80'),
(6, 'Saheliyon-ki-Bari (Courtyard of Maidens)', 'Nature', 'Historic ornamental garden with marble pavilions, lotus pools, bird-shaped fountains, and lush greenery.', 50.00, 1.5, 8.9, 24.6033, 73.6848, '09:00:00', '19:00:00', 'outdoor', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'),
(6, 'Bagore Ki Haveli Folk Dance & Museum', 'Culture', '18th-century royal haveli on Gangaur Ghat hosting nightly Dharohar Rajasthani dance shows and puppet theatre.', 100.00, 2.0, 9.4, 24.5804, 73.6809, '10:00:00', '20:00:00', 'indoor', 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80'),
(6, 'Monsoon Palace (Sajjangarh)', 'Adventure', 'Hilltop fortress built to watch monsoon clouds, providing dramatic bird''s eye vistas of Udaipur''s lakes.', 120.00, 2.5, 9.3, 24.5902, 73.6360, '09:00:00', '18:00:00', 'outdoor', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'),
(6, 'Fateh Sagar Lake & Nehru Park', 'Photography', 'Picturesque artificial lake with charming island park accessible by speedboat, perfect for peaceful strolls.', 100.00, 2.0, 9.1, 24.6015, 73.6705, '08:00:00', '20:00:00', 'outdoor', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80'),
(6, 'Hathi Pol Handicraft Bazaar', 'Shopping', 'Traditional market famed for miniature Pichwai paintings, authentic Mojaris, and Rajasthani wooden crafts.', 300.00, 2.0, 8.8, 24.5862, 73.6872, '10:00:00', '20:00:00', 'outdoor', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80'),
(6, 'Ambrai Ghat Romantic Dinner', 'Food', 'Iconic waterside dining spot offering Mewari delicacies directly across shimmering reflections of City Palace.', 600.00, 2.0, 9.5, 24.5779, 73.6801, '18:00:00', '23:00:00', 'mixed', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'),
(6, 'Vintage Car Museum', 'History', 'Private collection of grand vintage cars used by the Maharanas of Mewar including Rolls Royces and Cadillacs.', 250.00, 1.5, 8.7, 24.5721, 73.6968, '09:00:00', '21:00:00', 'indoor', 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80');

-- -------------------------------------------------------------
-- DESTINATION 7: MANALI (10 Places)
-- -------------------------------------------------------------
INSERT INTO places (destination_id, name, category, description, cost, duration, popularity, latitude, longitude, opening_time, closing_time, indoor_outdoor, image_url) VALUES
(7, 'Solang Valley Adventure Hub', 'Adventure', 'Alpine adventure paradise offering paragliding, zorbing, ATV quad biking, and winter snow skiing.', 600.00, 4.0, 9.8, 32.3166, 77.1583, '09:00:00', '18:00:00', 'outdoor', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80'),
(7, 'Hadimba Devi Temple', 'Culture', 'Unique 1553 pagoda-shaped wooden temple built around a natural cave sanctuary amidst towering deodar cedars.', 0.00, 1.5, 9.6, 32.2483, 77.1706, '08:00:00', '18:00:00', 'indoor', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'),
(7, 'Jogini Waterfall Trek', 'Nature', 'Scenic woodland trek from Vashisht village through apple orchards to a thunderous cascading waterfall.', 0.00, 3.0, 9.4, 32.2690, 77.1950, '07:00:00', '17:00:00', 'outdoor', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'),
(7, 'Old Manali Bohemian Cafes', 'Food', 'Rustic stone village packed with indie music cafes, apple crumble bakeries, and handmade riverfront dining.', 350.00, 2.5, 9.3, 32.2530, 77.1730, '09:00:00', '23:00:00', 'mixed', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'),
(7, 'Vashisht Natural Hot Springs', 'Relaxation', 'Ancient stone village temple housing therapeutic natural sulfur thermal spring baths overlooking the mountains.', 0.00, 1.5, 9.0, 32.2625, 77.1890, '07:00:00', '21:00:00', 'mixed', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'),
(7, 'Mall Road & Tibetan Monasteries', 'Shopping', 'Bustling pedestrian avenue featuring Tibetan handicraft stalls, woolen shawls, wooden carvings, and momos.', 250.00, 2.0, 9.1, 32.2425, 77.1890, '10:00:00', '22:00:00', 'mixed', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80'),
(7, 'Atal Tunnel & Sissu Valley Excursion', 'Photography', 'World''s longest highway tunnel above 10,000 feet leading to dramatic rugged Lahaul valley and frozen waterfalls.', 300.00, 4.5, 9.7, 32.3644, 77.1408, '07:00:00', '16:00:00', 'outdoor', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80'),
(7, 'Museum of Himachal Culture & Folk Art', 'History', 'Rich museum near Hadimba Temple with traditional Himachali models, antique costumes, and wooden temple carvings.', 30.00, 1.5, 8.7, 32.2470, 77.1700, '09:30:00', '18:00:00', 'indoor', 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80'),
(7, 'Manali Club House & River Games', 'Adventure', 'Riverside indoor amusement complex with roller skating rink, go-karts, billiards, and zip-lining over Manalsu river.', 200.00, 2.5, 8.8, 32.2538, 77.1702, '10:00:00', '20:00:00', 'mixed', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'),
(7, 'Beas Riverfront Riverside Camping', 'Relaxation', 'Peaceful pine riverside spot for bonfires, acoustic music, stargazing, and gentle river walks.', 500.00, 3.0, 9.2, 32.2280, 77.1850, '15:00:00', '22:00:00', 'outdoor', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80');

-- 4. Sample Trip for Demo User (Ahmedabad 2-Day Trip)
INSERT INTO trips (trip_id, user_id, destination_id, title, start_date, end_date, budget, travelers, transport, starting_location, trip_score) VALUES
(1, 1, 1, 'Ahmedabad Heritage & Food Explorer', '2026-10-15', '2026-10-16', 5000.00, 2, 'Public Transport', 'Hotel / Ahmedabad Railway Station', 91)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 5. Sample Preferences for the Demo Trip
INSERT INTO preferences (trip_id, category, weight) VALUES
(1, 'History', 9.0),
(1, 'Food', 9.5),
(1, 'Culture', 8.0),
(1, 'Photography', 7.5);

-- 6. Sample Itinerary for the Demo Trip
INSERT INTO itinerary (trip_id, day, place_id, start_time, end_time, sequence, notes) VALUES
(1, 1, 1, '09:00:00', '11:00:00', 1, 'Explore Gandhi Ashram and peaceful museum.'),
(1, 1, 2, '11:30:00', '13:00:00', 2, 'Subterranean architecture and photo-session.'),
(1, 1, 8, '15:00:00', '17:30:00', 3, 'Walk through Old City pols and wooden havelis.'),
(1, 1, 3, '19:30:00', '21:30:00', 4, 'Feast on street food, chocolate sandwiches and kulfi.'),
(1, 2, 7, '09:00:00', '11:30:00', 1, 'Morning stroll around the lake and gardens.'),
(1, 2, 5, '14:00:00', '15:00:00', 2, 'Admire the famous Tree of Life marble jaali.'),
(1, 2, 4, '17:30:00', '19:30:00', 3, 'Sunset stroll along the river promenade.');

-- 7. Sample Expenses for Demo Trip
INSERT INTO expenses (trip_id, category, amount, description) VALUES
(1, 'Transportation', 600.00, 'Metro & Auto Rickshaw fare for 2 days'),
(1, 'Accommodation', 2200.00, 'Standard Heritage Hotel stay'),
(1, 'Food', 1200.00, 'Manek Chowk, Gujarati Thali & snacks'),
(1, 'Activities', 250.00, 'Heritage walk & entry tickets'),
(1, 'Miscellaneous', 250.00, 'Souvenirs & water bottles');
