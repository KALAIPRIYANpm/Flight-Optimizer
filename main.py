from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import heapq

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

try:
    with open("data/airports.json", "r") as f:
        airports = json.load(f)

    with open("data/routes.json", "r") as f:
        routes = json.load(f)
except FileNotFoundError:
    print("Error: One or more data files are missing.")
    airports, routes = [], []

graph = {}
for route in routes:
    graph.setdefault(route["from"], []).append((route["to"], route["distance"]))

def find_optimal_route(origin, destination):
    """Finds the shortest route (based on distance) from origin to destination using Dijkstra's Algorithm."""
    
    city_to_airport = {airport["city"]: airport["code"] for airport in airports}
    origin_code = city_to_airport.get(origin)
    destination_code = city_to_airport.get(destination)

    if not origin_code or not destination_code:
        print(f"Error: Airport not found for {origin} -> {destination}")
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

@app.get("/")
def home():
    return {"message": "Flight Route Optimizer API is running!"}

@app.get("/search_flights/")
async def search_flights(origin: str, destination: str, preference: str):
    print(f"Searching for route: {origin} -> {destination}")

    route = find_optimal_route(origin, destination)

    if not route:
        print("No route found!")
        return {"message": "No available route"}

    return {
        "route": route,
        "ai_recommendation": f"Best route from {origin} to {destination} based on {preference}"
    }
