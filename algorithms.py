import sqlite3

def get_flight_data():
    conn = sqlite3.connect("data/flight.db")  # Ensure correct path
    cursor = conn.cursor()
    
    query = "SELECT flight_number, origin, destination, duration, layovers FROM flights"
    cursor.execute(query)
    
    flights = []
    for row in cursor.fetchall():
        flights.append({
            "flight_number": row[0],
            "origin": row[1],
            "destination": row[2],
            "duration": row[3],
            "layovers": row[4].split(",") if row[4] else []  # Assuming layovers are stored as comma-separated values
        })

    conn.close()
    return flights

# Dummy function to avoid import error
def find_optimal_route(origin, destination):
    return f"Optimal route from {origin} to {destination} (placeholder function)"

# Example usage
if __name__ == "__main__":
    print(get_flight_data())
    print(find_optimal_route("JFK", "LHR"))
