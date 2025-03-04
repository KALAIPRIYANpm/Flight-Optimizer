from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from algorithms import find_optimal_route  # Import your algorithm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend requests
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Flight Route Optimizer API is running!"}

@app.get("/search_flights/")
async def search_flights(origin: str, destination: str, preference: str):
    # Call your route-finding algorithm
    route = find_optimal_route(origin, destination, preference)
    
    if not route:
        return {"message": "No available route"}

    return {
        "route": route,  # Return the actual route
        "ai_recommendation": f"Best route from {origin} to {destination} based on {preference}"
    }
