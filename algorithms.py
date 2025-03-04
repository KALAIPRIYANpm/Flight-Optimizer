import sqlite3

def get_flight_data():
    conn = sqlite3.connect("backend/data/flights.db")  
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
            "layovers": row[4].split(",") if row[4] else []
        })

    conn.close()
    return flights

# def find_optimal_route(origin, destination):
#     flights = get_flight_data()
    
#     for flight in flights:
#         if flight["origin"] == origin and flight["destination"] == destination:
#             return [flight]

#     for flight1 in flights:
#         for flight2 in flights:
#             if flight1["origin"] == origin and flight1["destination"] == flight2["origin"] and flight2["destination"] == destination:
#                 return [flight1, flight2]
    
#     return []  

def find_optimal_route(origin, destination, preference):
    # Example: Replace with actual flight data from a database or API
    flight_routes = {
        ("Chennai", "Dubai"): ["Chennai International Airport", "Indira Gandhi International Airport", "Dubai International Airport"],
        ("Chennai", "Mumbai"): ["Chennai International Airport", "Chhatrapati Shivaji Maharaj International Airport"]
    }
    
    return flight_routes.get((origin, destination), None)


