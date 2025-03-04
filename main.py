from fastapi import FastAPI, Query
from algorithms import find_optimal_route
from ai_recommender import get_ai_suggestion

app = FastAPI()

@app.get("/search_flights/")
async def search_flights(
    origin: str, destination: str, preference: str = Query("shortest_time")
):
    route = find_optimal_route(origin, destination, preference)
    ai_suggestion = get_ai_suggestion(origin, destination, preference)
    
    return {"route": route, "ai_recommendation": ai_suggestion}

