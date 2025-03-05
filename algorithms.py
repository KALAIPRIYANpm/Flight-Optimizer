import json
import heapq

# Load airport and route data
try:
    with open("data/airports.json", "r") as f:
        airports = json.load(f)

    with open("data/routes.json", "r") as f:
        routes = json.load(f)
except FileNotFoundError:
    print("Error: One or more data files are missing.")
    airports, routes = [], []

# Build graph representation of routes
graph = {}
for route in routes:
    graph.setdefault(route["from"], []).append((route["to"], route["distance"]))


def find_optimal_route(origin, destination):
    """
    Finds the shortest route (based on distance) from origin city to destination city.
    Uses Dijkstra's Algorithm.
    """

    # Map cities to their corresponding airport codes
    city_to_airport = {airport["city"]: airport["code"] for airport in airports}
    origin_code = city_to_airport.get(origin)
    destination_code = city_to_airport.get(destination)

    if not origin_code or not destination_code:
        return None  

    
    pq = [(0, origin_code, [])]
    visited = set()

    while pq:
        distance, airport, path = heapq.heappop(pq)

        if airport in visited:
            continue
        visited.add(airport)
        path = path + [airport]

        if airport == destination_code:
            return [get_airport_name(code) for code in path]

        for neighbor, dist in graph.get(airport, []):
            if neighbor not in visited:
                heapq.heappush(pq, (distance + dist, neighbor, path))

    return None 


def get_airport_name(code):
    """Returns the airport name given an airport code."""
    for airport in airports:
        if airport["code"] == code:
            return airport["name"]
    return code  

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the distance between two latitude-longitude coordinates.
    Uses the Haversine formula.
    """
    from math import radians, sin, cos, sqrt, atan2

    R = 6371  

    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c  
