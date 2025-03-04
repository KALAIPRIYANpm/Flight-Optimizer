import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

function FlightSearch() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [preference, setPreference] = useState("shortest_time");
  const [result, setResult] = useState(null);

  const searchFlights = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/search_flights/?origin=${origin}&destination=${destination}&preference=${preference}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch flight data");
      }
  
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error fetching flight data:", error);
    }
  };
  

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 3, bgcolor: "background.paper", borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        <TravelExploreIcon sx={{ fontSize: 40, color: "primary.main" }} /> Flight Route Finder
      </Typography>

      <TextField
        fullWidth
        label="Origin"
        variant="outlined"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <FlightTakeoffIcon color="primary" />,
        }}
      />
      <TextField
        fullWidth
        label="Destination"
        variant="outlined"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <FlightLandIcon color="secondary" />,
        }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={searchFlights}
        sx={{ py: 1.5, fontSize: "1rem", fontWeight: "bold", textTransform: "none" }}
      >
        🚀 Find Route
      </Button>

      {result && (
        <Card sx={{ mt: 4, bgcolor: "grey.100" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              ✨ Optimal Route:
            </Typography>
            <Typography variant="body1" color="primary" sx={{ fontSize: "1.1rem", fontWeight: "bold", mt: 1 }}>
              {result.route ? result.route.join(" → ") : "No route found"}
            </Typography>

            {/* Display Distance Only If Available */}
            {result.distance && (
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                📏 Distance Between Airports:
              </Typography>
            )}

            
            {result.distance && (
              <Typography variant="body1" color="secondary" sx={{ fontSize: "1.1rem", fontWeight: "bold", mt: 1 }}>
                {result.distance} km
              </Typography>
            )}

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
              🧠 AI Recommendation:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {result.ai_recommendation}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default FlightSearch;
