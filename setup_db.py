import sqlite3
import os

# Ensure the "data" directory exists
db_path = "backend/data/flights.db"
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# Connect to (or create) the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create the flights table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS flights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flight_number TEXT NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        duration INTEGER NOT NULL,
        layovers TEXT
    )
''')

# Check if flights table is empty before inserting
cursor.execute("SELECT COUNT(*) FROM flights")
if cursor.fetchone()[0] == 0:
    sample_flights = [
        ("AI101", "JFK", "LHR", 420, "CDG"),
        ("BA202", "LHR", "DXB", 450, ""),
        ("EK303", "DXB", "SYD", 840, "BKK"),
        ("QR404", "DOH", "JFK", 780, "")
    ]

    cursor.executemany("INSERT INTO flights (flight_number, origin, destination, duration, layovers) VALUES (?, ?, ?, ?, ?)", sample_flights)
    conn.commit()
    print("✅ Database initialized with sample flight data.")
else:
    print("⚠️ Flights table already has data. No new insertions.")

conn.close()
