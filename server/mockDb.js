/**
 * SmartTrip - Resilient In-Memory Fallback Data Store
 * Mirrors the MySQL schema and seed data.
 * Used when MySQL is temporarily unavailable or credentials are being configured,
 * ensuring the application is ALWAYS runnable and testable.
 */

const bcrypt = require('bcryptjs');

// Preloaded Destinations
const destinations = [
  {
    destination_id: 1,
    name: 'Ahmedabad',
    state: 'Gujarat',
    description: 'India\'s first UNESCO World Heritage City, famous for serene ashrams, intricate stepwells, rich textiles, and legendary night food markets.',
    image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'October to March'
  },
  {
    destination_id: 2,
    name: 'Mumbai',
    state: 'Maharashtra',
    description: 'The dazzling City of Dreams with colonial architecture, bustling promenades, heritage caves, vibrant markets, and sea views.',
    image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'November to February'
  },
  {
    destination_id: 3,
    name: 'Jaipur',
    state: 'Rajasthan',
    description: 'The iconic Pink City celebrated for majestic Rajput fortresses, ornate royal palaces, vibrant bazaars, and opulent culture.',
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'October to March'
  },
  {
    destination_id: 4,
    name: 'Delhi',
    state: 'Delhi NCR',
    description: 'India\'s historic capital combining centuries of Mughal splendour, grand monuments, bustling Chandni Chowk lanes, and top museums.',
    image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'October to March'
  },
  {
    destination_id: 5,
    name: 'Goa',
    state: 'Goa',
    description: 'Sun-kissed beaches, coastal Portuguese churches, water adventure sports, spice plantations, and lively seaside nightlife.',
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'November to March'
  },
  {
    destination_id: 6,
    name: 'Udaipur',
    state: 'Rajasthan',
    description: 'The romantic City of Lakes boasting shimmering waters, magnificent marble palaces, art galleries, and serene sunset points.',
    image_url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'September to March'
  },
  {
    destination_id: 7,
    name: 'Manali',
    state: 'Himachal Pradesh',
    description: 'Breathtaking Himalayan valley destination featuring snow-capped peaks, alpine pine forests, river rafting, and cozy mountain cafes.',
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'Year-round (Snow: Dec-Feb)'
  }
];

// Preloaded Places (70 Places across 7 Cities)
const places = [
  // Ahmedabad (10)
  { place_id: 1, destination_id: 1, name: 'Sabarmati Ashram', category: 'History', description: 'Mahatma Gandhi\'s tranquil riverside headquarters from 1917 to 1930 with personal artifacts, museum gallery, and library.', cost: 0.00, duration: 2.0, popularity: 9.6, latitude: 23.0605, longitude: 72.5800, opening_time: '08:30:00', closing_time: '18:30:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80' },
  { place_id: 2, destination_id: 1, name: 'Adalaj Stepwell', category: 'Culture', description: 'Magnificent 15th-century five-story subterranean architectural marvel with intricate Hindu and Solanki carvings.', cost: 50.00, duration: 1.5, popularity: 9.4, latitude: 23.1667, longitude: 72.5804, opening_time: '08:00:00', closing_time: '18:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1599831104328-5696144e59df?auto=format&fit=crop&w=600&q=80' },
  { place_id: 3, destination_id: 1, name: 'Manek Chowk Night Food Market', category: 'Food', description: 'Historic city square buzzing at night with legendary street delicacies like chocolate sandwiches, pav bhaji, and kulfi.', cost: 250.00, duration: 2.0, popularity: 9.5, latitude: 23.0248, longitude: 72.5890, opening_time: '19:30:00', closing_time: '23:59:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { place_id: 4, destination_id: 1, name: 'Sabarmati Riverfront Walk', category: 'Nature', description: 'Serene landscaped promenade along the Sabarmati river with lush gardens, cycling tracks, and sunset vantage points.', cost: 30.00, duration: 2.0, popularity: 9.1, latitude: 23.0370, longitude: 72.5714, opening_time: '09:00:00', closing_time: '21:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { place_id: 5, destination_id: 1, name: 'Sidi Saiyyed Mosque', category: 'History', description: 'Famed 16th-century mosque world-renowned for its delicately carved marble stone lattice window, the Tree of Life.', cost: 0.00, duration: 1.0, popularity: 9.2, latitude: 23.0270, longitude: 72.5815, opening_time: '07:00:00', closing_time: '19:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
  { place_id: 6, destination_id: 1, name: 'Calico Museum of Textiles', category: 'Culture', description: 'Premier textile museum showcasing historic Indian fabrics, royal court costumes, and Mughal miniature tapestries.', cost: 100.00, duration: 2.5, popularity: 8.9, latitude: 23.0560, longitude: 72.5930, opening_time: '10:30:00', closing_time: '13:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80' },
  { place_id: 7, destination_id: 1, name: 'Kankaria Lake & Entertainment Hub', category: 'Relaxation', description: 'Iconic 15th-century polygonal lake offering toy train rides, balloon safari, peaceful lake walks, and zoo.', cost: 50.00, duration: 2.5, popularity: 9.0, latitude: 22.9983, longitude: 72.6030, opening_time: '09:00:00', closing_time: '22:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  { place_id: 8, destination_id: 1, name: 'Old City Heritage Walk', category: 'Photography', description: 'Guided morning journey through historic pols, wooden havelis, secret passageways, and bird feeders.', cost: 150.00, duration: 2.5, popularity: 9.3, latitude: 23.0260, longitude: 72.5900, opening_time: '07:30:00', closing_time: '10:30:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80' },
  { place_id: 9, destination_id: 1, name: 'Law Garden Traditional Night Market', category: 'Shopping', description: 'Lively market famous for authentic Kutchi embroidered kurtas, chaniya cholis, antique jewelry, and snacks.', cost: 400.00, duration: 2.0, popularity: 8.8, latitude: 23.0267, longitude: 72.5601, opening_time: '17:00:00', closing_time: '22:30:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80' },
  { place_id: 10, destination_id: 1, name: 'Science City IMAX & Robotics Gallery', category: 'Adventure', description: 'Massive science complex featuring humanoid robotics, planetarium, aquatic gallery, and interactive IMAX theater.', cost: 350.00, duration: 3.0, popularity: 9.2, latitude: 23.0784, longitude: 72.4975, opening_time: '10:00:00', closing_time: '20:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80' },

  // Mumbai (10)
  { place_id: 11, destination_id: 2, name: 'Gateway of India', category: 'History', description: 'Majestic basalt arch overlooking the Arabian Sea built in 1924 to commemorate King George V\'s visit.', cost: 0.00, duration: 1.5, popularity: 9.8, latitude: 18.9220, longitude: 72.8347, opening_time: '06:00:00', closing_time: '23:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
  { place_id: 12, destination_id: 2, name: 'Elephanta Caves Ferry & Tour', category: 'Culture', description: 'UNESCO World Heritage rock-cut cave temples dedicated to Lord Shiva situated on an island in Mumbai harbour.', cost: 260.00, duration: 4.0, popularity: 9.3, latitude: 18.9633, longitude: 72.9315, opening_time: '09:00:00', closing_time: '17:30:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
  { place_id: 13, destination_id: 2, name: 'Marine Drive & Queens Necklace', category: 'Relaxation', description: 'Sweeping 3.6-kilometer seaside promenade offering breezy sea walks, sunset views, and iconic street life.', cost: 0.00, duration: 2.0, popularity: 9.7, latitude: 18.9432, longitude: 72.8230, opening_time: '06:00:00', closing_time: '23:59:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80' },
  { place_id: 14, destination_id: 2, name: 'Chhatrapati Shivaji Maharaj Vastu Museum', category: 'History', description: 'Premier art and history museum housed in grand Indo-Saracenic building with over 50,000 rare exhibits.', cost: 150.00, duration: 2.5, popularity: 9.1, latitude: 18.9268, longitude: 72.8327, opening_time: '10:15:00', closing_time: '18:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80' },
  { place_id: 15, destination_id: 2, name: 'Colaba Causeway Shopping & Cafes', category: 'Shopping', description: 'Buzzing street market famous for antique curios, boho fashion, brass knick-knacks, and historic Leopold Cafe.', cost: 300.00, duration: 2.5, popularity: 9.0, latitude: 18.9195, longitude: 72.8315, opening_time: '10:00:00', closing_time: '22:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80' },
  { place_id: 16, destination_id: 2, name: 'Girgaon Chowpatty Street Feast', category: 'Food', description: 'Iconic sandy beach renowned for Mumbai street snacks: bhelpuri, sev puri, pav bhaji, and badam kulfi.', cost: 200.00, duration: 1.5, popularity: 9.2, latitude: 18.9548, longitude: 72.8143, opening_time: '16:00:00', closing_time: '23:30:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { place_id: 17, destination_id: 2, name: 'Sanjay Gandhi National Park & Kanheri Caves', category: 'Adventure', description: 'Sprawling metropolitan nature park with ancient Buddhist rock-cut caves, cycling trails, and deer safari.', cost: 120.00, duration: 3.5, popularity: 8.8, latitude: 19.2288, longitude: 72.9182, opening_time: '07:30:00', closing_time: '18:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' },
  { place_id: 18, destination_id: 2, name: 'Bandra Bandstand & Sea Link Vista', category: 'Photography', description: 'Chic coastal strip with celebrity homes, amphitheatre, rocky shores, and breathtaking views of the Bandra-Worli Sea Link.', cost: 0.00, duration: 1.5, popularity: 8.9, latitude: 19.0434, longitude: 72.8197, opening_time: '06:00:00', closing_time: '23:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80' },
  { place_id: 19, destination_id: 2, name: 'Haji Ali Dargah', category: 'Religious', description: 'Historic Indo-Islamic shrine and mosque perched on an islet in the Arabian Sea accessible by a narrow tidal causeway.', cost: 0.00, duration: 1.5, popularity: 9.3, latitude: 18.9774, longitude: 72.8111, opening_time: '06:00:00', closing_time: '21:30:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80' },
  { place_id: 20, destination_id: 2, name: 'Lower Parel Nightlife & Microbreweries', category: 'Nightlife', description: 'Transformed mill district boasting cutting-edge rooftop lounges, craft breweries, and trendy dining experiences.', cost: 800.00, duration: 3.0, popularity: 9.1, latitude: 18.9950, longitude: 72.8258, opening_time: '18:00:00', closing_time: '23:59:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80' },

  // Jaipur (10)
  { place_id: 21, destination_id: 3, name: 'Amber Fort & Palace', category: 'History', description: 'Grand hilltop fort featuring majestic Rajput architecture, Sheesh Mahal (Mirror Palace), and Maota Lake views.', cost: 200.00, duration: 3.0, popularity: 9.8, latitude: 26.9855, longitude: 75.8513, opening_time: '08:00:00', closing_time: '18:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80' },
  { place_id: 22, destination_id: 3, name: 'Hawa Mahal (Palace of Winds)', category: 'Photography', description: 'Iconic five-story pink sandstone palace with 953 ornate latticed windows designed for royal women.', cost: 50.00, duration: 1.5, popularity: 9.7, latitude: 26.9239, longitude: 75.8267, opening_time: '09:00:00', closing_time: '17:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80' },
  { place_id: 23, destination_id: 3, name: 'City Palace Complex', category: 'Culture', description: 'Magnificent royal residence combining Mughal and Rajput styles with museum galleries and royal courtyards.', cost: 300.00, duration: 2.5, popularity: 9.4, latitude: 26.9258, longitude: 75.8237, opening_time: '09:30:00', closing_time: '17:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80' },
  { place_id: 24, destination_id: 3, name: 'Jantar Mantar Astronomical Observatory', category: 'History', description: 'UNESCO World Heritage 18th-century stone astronomical instruments including the world\'s largest stone sundial.', cost: 100.00, duration: 1.5, popularity: 9.1, latitude: 26.9248, longitude: 75.8246, opening_time: '09:00:00', closing_time: '17:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
  { place_id: 25, destination_id: 3, name: 'Nahargarh Fort Sunset Viewpoint', category: 'Adventure', description: 'Fortress perched on the edge of the Aravalli Hills offering sweeping panoramic views of the pink city.', cost: 100.00, duration: 2.5, popularity: 9.5, latitude: 26.9372, longitude: 75.8156, opening_time: '10:00:00', closing_time: '21:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  { place_id: 26, destination_id: 3, name: 'Johari Bazaar & Bapu Bazaar', category: 'Shopping', description: 'Colorful traditional markets renowned for gemstone jewelry, Jaipuri quilts, leather juttis, and block prints.', cost: 350.00, duration: 2.5, popularity: 9.0, latitude: 26.9197, longitude: 75.8265, opening_time: '10:30:00', closing_time: '20:30:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80' },
  { place_id: 27, destination_id: 3, name: 'Albert Hall Central Museum', category: 'Culture', description: 'Oldest museum in Rajasthan displaying rare paintings, Persian carpets, Egyptian mummy, and metal crafts.', cost: 150.00, duration: 2.0, popularity: 8.8, latitude: 26.9116, longitude: 75.8195, opening_time: '09:00:00', closing_time: '17:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80' },
  { place_id: 28, destination_id: 3, name: 'Chokhi Dhani Ethnic Village Resort', category: 'Food', description: 'Immersive Rajasthani cultural village with traditional folk dance, puppet shows, camel rides, and royal thali.', cost: 700.00, duration: 3.5, popularity: 9.4, latitude: 26.7663, longitude: 75.8361, opening_time: '17:30:00', closing_time: '23:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { place_id: 29, destination_id: 3, name: 'Govind Dev Ji Temple', category: 'Religious', description: 'Venerable Vaishnavite temple inside City Palace grounds buzzing with devotional songs and royal aartis.', cost: 0.00, duration: 1.0, popularity: 9.2, latitude: 26.9290, longitude: 75.8240, opening_time: '05:00:00', closing_time: '20:30:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80' },
  { place_id: 30, destination_id: 3, name: 'Jal Mahal Lake Pavilion', category: 'Relaxation', description: 'Picturesque 18th-century palace resting in the middle of Man Sagar Lake, surrounded by the Aravalli hills.', cost: 0.00, duration: 1.0, popularity: 9.3, latitude: 26.9535, longitude: 75.8462, opening_time: '06:00:00', closing_time: '22:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },

  // Delhi (10)
  { place_id: 31, destination_id: 4, name: 'Qutub Minar Complex', category: 'History', description: '73-meter soaring minaret built in 1192 surrounded by ancient ruins, Iron Pillar, and intricate carvings.', cost: 50.00, duration: 2.0, popularity: 9.6, latitude: 28.5245, longitude: 77.1855, opening_time: '07:00:00', closing_time: '18:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
  { place_id: 32, destination_id: 4, name: 'Humayun\'s Tomb', category: 'History', description: 'Splendid garden tomb of Mughal Emperor Humayun, inspiration for the Taj Mahal, set within charbagh gardens.', cost: 50.00, duration: 2.0, popularity: 9.5, latitude: 28.5933, longitude: 77.2507, opening_time: '06:00:00', closing_time: '18:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
  { place_id: 33, destination_id: 4, name: 'National Museum of India', category: 'Culture', description: 'Premier cultural museum housing 200,000 works of art spanning 5,000 years from Indus Valley to modern era.', cost: 50.00, duration: 3.0, popularity: 9.2, latitude: 28.6118, longitude: 77.2193, opening_time: '10:00:00', closing_time: '18:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80' },
  { place_id: 34, destination_id: 4, name: 'Chandni Chowk & Paranthe Wali Gali', category: 'Food', description: 'Legendary 17th-century bustling food lane serving stuffed deep-fried paranthas, jalebis, and sweet lassi.', cost: 200.00, duration: 2.5, popularity: 9.7, latitude: 28.6562, longitude: 77.2301, opening_time: '09:00:00', closing_time: '22:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { place_id: 35, destination_id: 4, name: 'Lotus Temple (Bahá\'í House of Worship)', category: 'Relaxation', description: 'Iconic flower-shaped marble temple welcoming all religions for peaceful silent meditation and reflection.', cost: 0.00, duration: 1.5, popularity: 9.4, latitude: 28.5535, longitude: 77.2588, opening_time: '09:00:00', closing_time: '17:30:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80' },
  { place_id: 36, destination_id: 4, name: 'India Gate & Kartavya Path', category: 'Photography', description: 'War memorial arch honoring soldiers, flanked by lush manicured lawns, fountains, and vibrant evening lighting.', cost: 0.00, duration: 1.5, popularity: 9.6, latitude: 28.6129, longitude: 77.2295, opening_time: '06:00:00', closing_time: '23:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80' },
  { place_id: 37, destination_id: 4, name: 'Dilli Haat Crafts Market', category: 'Shopping', description: 'Open-air food plaza and craft bazaar showcasing authentic handicrafts and regional foods from all Indian states.', cost: 50.00, duration: 2.5, popularity: 9.1, latitude: 28.5732, longitude: 77.2078, opening_time: '10:30:00', closing_time: '22:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80' },
  { place_id: 38, destination_id: 4, name: 'Akshardham Temple Complex', category: 'Religious', description: 'Colossal spiritual complex featuring sculpted mandirs, musical fountain show, garden exhibitions, and boat ride.', cost: 250.00, duration: 3.5, popularity: 9.6, latitude: 28.6127, longitude: 77.2773, opening_time: '09:30:00', closing_time: '19:30:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80' },
  { place_id: 39, destination_id: 4, name: 'Lodhi Art District & Lodhi Gardens', category: 'Nature', description: 'Serene Mughal tomb gardens adjacent to India\'s first open-air public street art district with giant murals.', cost: 0.00, duration: 2.0, popularity: 9.0, latitude: 28.5898, longitude: 77.2209, opening_time: '06:00:00', closing_time: '20:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' },
  { place_id: 40, destination_id: 4, name: 'Hauz Khas Village Cafes & Fort', category: 'Nightlife', description: 'Trendy neighborhood combining medieval 13th-century reservoir ruins with indie fashion boutiques and chic bars.', cost: 600.00, duration: 3.0, popularity: 9.0, latitude: 28.5539, longitude: 77.1942, opening_time: '11:00:00', closing_time: '23:59:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80' },

  // Goa (10)
  { place_id: 41, destination_id: 5, name: 'Calangute & Baga Beach', category: 'Adventure', description: 'The heart of North Goa watersports: parasailing, jet skiing, banana boat rides, and lively beach shacks.', cost: 400.00, duration: 3.5, popularity: 9.6, latitude: 15.5439, longitude: 73.7553, opening_time: '06:00:00', closing_time: '22:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
  { place_id: 42, destination_id: 5, name: 'Basilica of Bom Jesus', category: 'History', description: 'UNESCO World Heritage 16th-century baroque church holding the sacred mortal remains of St. Francis Xavier.', cost: 0.00, duration: 1.5, popularity: 9.4, latitude: 15.5009, longitude: 73.9116, opening_time: '09:00:00', closing_time: '18:30:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
  { place_id: 43, destination_id: 5, name: 'Fontainhas Latin Quarter Walk', category: 'Photography', description: 'Charming historic Portuguese quarter with colorful pastel villas, ornate wooden balconies, and heritage art cafes.', cost: 0.00, duration: 2.0, popularity: 9.3, latitude: 15.4989, longitude: 73.8322, opening_time: '07:00:00', closing_time: '19:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80' },
  { place_id: 44, destination_id: 5, name: 'Fort Aguada & Lighthouse', category: 'History', description: '17th-century Portuguese fortress overlooking Sinquerim Beach, offering ocean panoramas and historic water reservoir.', cost: 50.00, duration: 2.0, popularity: 9.2, latitude: 15.4925, longitude: 73.7736, opening_time: '09:30:00', closing_time: '17:30:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  { place_id: 45, destination_id: 5, name: 'Dudhsagar Waterfalls Trek', category: 'Nature', description: 'Majestic four-tiered waterfall cascading down 310 meters on the Mandovi River through lush Bhagwan Mahavir Sanctuary.', cost: 500.00, duration: 5.0, popularity: 9.5, latitude: 15.3144, longitude: 74.3143, opening_time: '07:00:00', closing_time: '16:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' },
  { place_id: 46, destination_id: 5, name: 'Anjuna Flea Market', category: 'Shopping', description: 'Famous beachfront bazaar packed with bohemian clothes, handmade jewelry, musical instruments, and crafts.', cost: 200.00, duration: 2.5, popularity: 8.9, latitude: 15.5786, longitude: 73.7423, opening_time: '09:00:00', closing_time: '18:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80' },
  { place_id: 47, destination_id: 5, name: 'Goan Spice Plantation Tour & Traditional Lunch', category: 'Food', description: 'Guided aromatic walk through pepper, vanilla, and cardamom plantations followed by traditional Goan fish curry buffet.', cost: 450.00, duration: 3.0, popularity: 9.1, latitude: 15.4371, longitude: 74.0205, opening_time: '10:00:00', closing_time: '16:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { place_id: 48, destination_id: 5, name: 'Tito\'s Lane Nightlife & Beach Clubs', category: 'Nightlife', description: 'Electrifying nightlife strip in Baga packed with world-famous clubs, DJ sets, dance floors, and cocktails.', cost: 800.00, duration: 4.0, popularity: 9.3, latitude: 15.5539, longitude: 73.7540, opening_time: '19:00:00', closing_time: '23:59:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80' },
  { place_id: 49, destination_id: 5, name: 'Palolem Beach Relaxation', category: 'Relaxation', description: 'Pristine crescent bay in South Goa with calm turquoise waters, colorful wooden beach huts, and gentle kayaking.', cost: 0.00, duration: 3.0, popularity: 9.5, latitude: 15.0100, longitude: 74.0232, opening_time: '06:00:00', closing_time: '22:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { place_id: 50, destination_id: 5, name: 'Goa Chitra Museum', category: 'Culture', description: 'Ecological museum displaying over 4,000 traditional indigenous Goan agricultural and agrarian artifacts.', cost: 150.00, duration: 2.0, popularity: 8.6, latitude: 15.2630, longitude: 73.9480, opening_time: '09:00:00', closing_time: '18:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80' },

  // Udaipur (10)
  { place_id: 51, destination_id: 6, name: 'City Palace of Udaipur', category: 'History', description: 'Grand lakeside royal palace complex boasting intricate mirror work, marble courtyards, and museum galleries.', cost: 300.00, duration: 3.0, popularity: 9.8, latitude: 24.5764, longitude: 73.6835, opening_time: '09:00:00', closing_time: '17:30:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80' },
  { place_id: 52, destination_id: 6, name: 'Lake Pichola Sunset Boat Cruise', category: 'Relaxation', description: 'Iconic evening cruise gliding past the floating Lake Palace, Jag Mandir island, and illuminated city skyline.', cost: 450.00, duration: 1.5, popularity: 9.7, latitude: 24.5732, longitude: 73.6782, opening_time: '09:00:00', closing_time: '18:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { place_id: 53, destination_id: 6, name: 'Jagdish Temple', category: 'Religious', description: 'Magnificent 1651 Hindu temple dedicated to Lord Vishnu featuring ornate pillars, spire, and stone elephant carvings.', cost: 0.00, duration: 1.0, popularity: 9.0, latitude: 24.5795, longitude: 73.6842, opening_time: '05:30:00', closing_time: '21:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80' },
  { place_id: 54, destination_id: 6, name: 'Saheliyon-ki-Bari (Courtyard of Maidens)', category: 'Nature', description: 'Historic ornamental garden with marble pavilions, lotus pools, bird-shaped fountains, and lush greenery.', cost: 50.00, duration: 1.5, popularity: 8.9, latitude: 24.6033, longitude: 73.6848, opening_time: '09:00:00', closing_time: '19:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' },
  { place_id: 55, destination_id: 6, name: 'Bagore Ki Haveli Folk Dance & Museum', category: 'Culture', description: '18th-century royal haveli on Gangaur Ghat hosting nightly Dharohar Rajasthani dance shows and puppet theatre.', cost: 100.00, duration: 2.0, popularity: 9.4, latitude: 24.5804, longitude: 73.6809, opening_time: '10:00:00', closing_time: '20:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80' },
  { place_id: 56, destination_id: 6, name: 'Monsoon Palace (Sajjangarh)', category: 'Adventure', description: 'Hilltop fortress built to watch monsoon clouds, providing dramatic bird\'s eye vistas of Udaipur\'s lakes.', cost: 120.00, duration: 2.5, popularity: 9.3, latitude: 24.5902, longitude: 73.6360, opening_time: '09:00:00', closing_time: '18:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  { place_id: 57, destination_id: 6, name: 'Fateh Sagar Lake & Nehru Park', category: 'Photography', description: 'Picturesque artificial lake with charming island park accessible by speedboat, perfect for peaceful strolls.', cost: 100.00, duration: 2.0, popularity: 9.1, latitude: 24.6015, longitude: 73.6705, opening_time: '08:00:00', closing_time: '20:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80' },
  { place_id: 58, destination_id: 6, name: 'Hathi Pol Handicraft Bazaar', category: 'Shopping', description: 'Traditional market famed for miniature Pichwai paintings, authentic Mojaris, and Rajasthani wooden crafts.', cost: 300.00, duration: 2.0, popularity: 8.8, latitude: 24.5862, longitude: 73.6872, opening_time: '10:00:00', closing_time: '20:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80' },
  { place_id: 59, destination_id: 6, name: 'Ambrai Ghat Romantic Dinner', category: 'Food', description: 'Iconic waterside dining spot offering Mewari delicacies directly across shimmering reflections of City Palace.', cost: 600.00, duration: 2.0, popularity: 9.5, latitude: 24.5779, longitude: 73.6801, opening_time: '18:00:00', closing_time: '23:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { place_id: 60, destination_id: 6, name: 'Vintage Car Museum', category: 'History', description: 'Private collection of grand vintage cars used by the Maharanas of Mewar including Rolls Royces and Cadillacs.', cost: 250.00, duration: 1.5, popularity: 8.7, latitude: 24.5721, longitude: 73.6968, opening_time: '09:00:00', closing_time: '21:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80' },

  // Manali (10)
  { place_id: 61, destination_id: 7, name: 'Solang Valley Adventure Hub', category: 'Adventure', description: 'Alpine adventure paradise offering paragliding, zorbing, ATV quad biking, and winter snow skiing.', cost: 600.00, duration: 4.0, popularity: 9.8, latitude: 32.3166, longitude: 77.1583, opening_time: '09:00:00', closing_time: '18:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' },
  { place_id: 62, destination_id: 7, name: 'Hadimba Devi Temple', category: 'Culture', description: 'Unique 1553 pagoda-shaped wooden temple built around a natural cave sanctuary amidst towering deodar cedars.', cost: 0.00, duration: 1.5, popularity: 9.6, latitude: 32.2483, longitude: 77.1706, opening_time: '08:00:00', closing_time: '18:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
  { place_id: 63, destination_id: 7, name: 'Jogini Waterfall Trek', category: 'Nature', description: 'Scenic woodland trek from Vashisht village through apple orchards to a thunderous cascading waterfall.', cost: 0.00, duration: 3.0, popularity: 9.4, latitude: 32.2690, longitude: 77.1950, opening_time: '07:00:00', closing_time: '17:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' },
  { place_id: 64, destination_id: 7, name: 'Old Manali Bohemian Cafes', category: 'Food', description: 'Rustic stone village packed with indie music cafes, apple crumble bakeries, and handmade riverfront dining.', cost: 350.00, duration: 2.5, popularity: 9.3, latitude: 32.2530, longitude: 77.1730, opening_time: '09:00:00', closing_time: '23:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { place_id: 65, destination_id: 7, name: 'Vashisht Natural Hot Springs', category: 'Relaxation', description: 'Ancient stone village temple housing therapeutic natural sulfur thermal spring baths overlooking the mountains.', cost: 0.00, duration: 1.5, popularity: 9.0, latitude: 32.2625, longitude: 77.1890, opening_time: '07:00:00', closing_time: '21:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { place_id: 66, destination_id: 7, name: 'Mall Road & Tibetan Monasteries', category: 'Shopping', description: 'Bustling pedestrian avenue featuring Tibetan handicraft stalls, woolen shawls, wooden carvings, and momos.', cost: 250.00, duration: 2.0, popularity: 9.1, latitude: 32.2425, longitude: 77.1890, opening_time: '10:00:00', closing_time: '22:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80' },
  { place_id: 67, destination_id: 7, name: 'Atal Tunnel & Sissu Valley Excursion', category: 'Photography', description: 'World\'s longest highway tunnel above 10,000 feet leading to dramatic rugged Lahaul valley and frozen waterfalls.', cost: 300.00, duration: 4.5, popularity: 9.7, latitude: 32.3644, longitude: 77.1408, opening_time: '07:00:00', closing_time: '16:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80' },
  { place_id: 68, destination_id: 7, name: 'Museum of Himachal Culture & Folk Art', category: 'History', description: 'Rich museum near Hadimba Temple with traditional Himachali models, antique costumes, and wooden temple carvings.', cost: 30.00, duration: 1.5, popularity: 8.7, latitude: 32.2470, longitude: 77.1700, opening_time: '09:30:00', closing_time: '18:00:00', indoor_outdoor: 'indoor', image_url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80' },
  { place_id: 69, destination_id: 7, name: 'Manali Club House & River Games', category: 'Adventure', description: 'Riverside indoor amusement complex with roller skating rink, go-karts, billiards, and zip-lining over Manalsu river.', cost: 200.00, duration: 2.5, popularity: 8.8, latitude: 32.2538, longitude: 77.1702, opening_time: '10:00:00', closing_time: '20:00:00', indoor_outdoor: 'mixed', image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80' },
  { place_id: 70, destination_id: 7, name: 'Beas Riverfront Riverside Camping', category: 'Relaxation', description: 'Peaceful pine riverside spot for bonfires, acoustic music, stargazing, and gentle river walks.', cost: 500.00, duration: 3.0, popularity: 9.2, latitude: 32.2280, longitude: 77.1850, opening_time: '15:00:00', closing_time: '22:00:00', indoor_outdoor: 'outdoor', image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' }
];

// Preloaded Users
const users = [
  {
    user_id: 1,
    name: 'Demo Explorer',
    email: 'demo@smarttrip.com',
    password: bcrypt.hashSync('password123', 10),
    created_at: new Date()
  }
];

// In-Memory Trips Store
const trips = [
  {
    trip_id: 1,
    user_id: 1,
    destination_id: 1,
    title: 'Ahmedabad Heritage & Food Explorer',
    start_date: '2026-10-15',
    end_date: '2026-10-16',
    budget: 5000.00,
    travelers: 2,
    transport: 'Public Transport',
    starting_location: 'Hotel / Ahmedabad Railway Station',
    trip_score: 91,
    created_at: new Date()
  }
];

// In-Memory Preferences Store
const preferences = [
  { preference_id: 1, trip_id: 1, category: 'History', weight: 9.0 },
  { preference_id: 2, trip_id: 1, category: 'Food', weight: 9.5 },
  { preference_id: 3, trip_id: 1, category: 'Culture', weight: 8.0 },
  { preference_id: 4, trip_id: 1, category: 'Photography', weight: 7.5 }
];

// In-Memory Itinerary Store
const itinerary = [
  { itinerary_id: 1, trip_id: 1, day: 1, place_id: 1, start_time: '09:00:00', end_time: '11:00:00', sequence: 1, notes: 'Explore Gandhi Ashram and peaceful museum.' },
  { itinerary_id: 2, trip_id: 1, day: 1, place_id: 2, start_time: '11:30:00', end_time: '13:00:00', sequence: 2, notes: 'Subterranean architecture and photo-session.' },
  { itinerary_id: 3, trip_id: 1, day: 1, place_id: 8, start_time: '15:00:00', end_time: '17:30:00', sequence: 3, notes: 'Walk through Old City pols and wooden havelis.' },
  { itinerary_id: 4, trip_id: 1, day: 1, place_id: 3, start_time: '19:30:00', end_time: '21:30:00', sequence: 4, notes: 'Feast on street food, chocolate sandwiches and kulfi.' },
  { itinerary_id: 5, trip_id: 1, day: 2, place_id: 7, start_time: '09:00:00', end_time: '11:30:00', sequence: 1, notes: 'Morning stroll around the lake and gardens.' },
  { itinerary_id: 6, trip_id: 1, day: 2, place_id: 5, start_time: '14:00:00', end_time: '15:00:00', sequence: 2, notes: 'Admire the famous Tree of Life marble jaali.' },
  { itinerary_id: 7, trip_id: 1, day: 2, place_id: 4, start_time: '17:30:00', end_time: '19:30:00', sequence: 3, notes: 'Sunset stroll along the river promenade.' }
];

// In-Memory Expenses Store
const expenses = [
  { expense_id: 1, trip_id: 1, category: 'Transportation', amount: 600.00, description: 'Metro & Auto Rickshaw fare for 2 days' },
  { expense_id: 2, trip_id: 1, category: 'Accommodation', amount: 2200.00, description: 'Standard Heritage Hotel stay' },
  { expense_id: 3, trip_id: 1, category: 'Food', amount: 1200.00, description: 'Manek Chowk, Gujarati Thali & snacks' },
  { expense_id: 4, trip_id: 1, category: 'Activities', amount: 250.00, description: 'Heritage walk & entry tickets' },
  { expense_id: 5, trip_id: 1, category: 'Miscellaneous', amount: 250.00, description: 'Souvenirs & water bottles' }
];

module.exports = {
  destinations,
  places,
  users,
  trips,
  preferences,
  itinerary,
  expenses
};
