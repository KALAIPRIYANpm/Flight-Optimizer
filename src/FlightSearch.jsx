import { useState } from "react";
import axios from "axios";

function FlightSearch() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [preference, setPreference] = useState("shortest_time");
  const [result, setResult] = useState(null);

  const searchFlights = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/search_flights/`, {
      params: { origin, destination, preference },
    });
    setResult(res.data);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Flight Route Finder</h1>
      <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" className="border p-2 w-full"/>
      <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" className="border p-2 w-full mt-2"/>
      <button onClick={searchFlights} className="bg-blue-500 text-white p-2 mt-4 w-full">Find Route</button>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100">
          <h2 className="text-lg font-bold">Optimal Route:</h2>
          <p>{result.route.join(" → ")}</p>
          <h2 className="text-lg font-bold mt-2">AI Recommendation:</h2>
          <p>{result.ai_recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default FlightSearch;
