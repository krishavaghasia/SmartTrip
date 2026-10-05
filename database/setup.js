/**
 * SmartTrip - Database Setup Script
 * Automates creating smarttrip_db, applying schema.sql, and loading seed.sql
 * Run with: npm run setup-db
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  multipleStatements: true
};

async function setupDatabase() {
  console.log('====================================================');
  console.log('   SmartTrip - MySQL Database Setup Utility');
  console.log('====================================================');
  console.log(`Connecting to MySQL at ${dbConfig.host}:${dbConfig.port} as user "${dbConfig.user}"...`);

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log(' Connected to MySQL server successfully!');

    // Read and run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log(` Reading schema from: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await connection.query(schemaSql);
    console.log(' Database schema applied successfully! (Database: smarttrip_db)');

    // Read and run seed.sql
    const seedPath = path.join(__dirname, 'seed.sql');
    console.log(` Reading seed data from: ${seedPath}`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    await connection.query(seedSql);
    console.log(' Sample seed data inserted successfully! (7 Destinations, 70+ Places, Demo User)');

    console.log('====================================================');
    console.log(' Database setup completed with 100% success!');
    console.log(' You can now start the application with: npm start');
    console.log('====================================================');
  } catch (err) {
    console.error('\n Database Setup Error:');
    console.error(err.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your MySQL service is running.');
    console.log('2. Check your password in the .env file (DB_PASSWORD=your_password).');
    console.log('3. Example .env configuration:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_USER=root');
    console.log('   DB_PASSWORD=your_root_password');
    console.log('   DB_NAME=smarttrip_db');
    console.log('   PORT=3000');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
