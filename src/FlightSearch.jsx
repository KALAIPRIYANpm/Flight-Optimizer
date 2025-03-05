import { useState, useEffect, useRef } from "react";
import { TextField, Button, Typography, Box, CircularProgress, Paper, Tabs, Tab } from "@mui/material";
import * as d3 from "d3";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

function FlightSearch() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [preference, setPreference] = useState("shortest_time");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const svgRef = useRef();

  const searchFlights = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/search_flights/?origin=${origin}&destination=${destination}&preference=${preference}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) throw new Error("Failed to fetch flight data");

      const data = await res.json();
      console.log("API Response:", data);

      if (!data.route || !Array.isArray(data.route) || data.route.length === 0) {
        throw new Error("No valid route found.");
      }

      setResult(data);
      setTabIndex(1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!result || !result.route) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = Math.min(window.innerWidth - 50, 700);
    const height = 300;
    const margin = 50;

    svg.attr("width", width).attr("height", height);

    const xScale = d3.scalePoint().domain(result.route).range([margin, width - margin]);

    const yPositions = result.route.map((_, i) => height / 2 + (i % 2 === 0 ? -40 : 40));

    const line = d3.line()
      .x((_, i) => xScale(result.route[i]))
      .y((_, i) => yPositions[i])
      .curve(d3.curveBasis);

    svg.append("path")
      .datum(result.route)
      .attr("d", line)
      .attr("stroke", "#007BFF")
      .attr("stroke-width", 3)
      .attr("fill", "none")
      .attr("stroke-dasharray", function () { return this.getTotalLength(); })
      .attr("stroke-dashoffset", function () { return this.getTotalLength(); })
      .transition().duration(2000).ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    svg.selectAll(".airport")
      .data(result.route)
      .enter()
      .append("circle")
      .attr("cx", (_, i) => xScale(result.route[i]))
      .attr("cy", (_, i) => yPositions[i])
      .attr("r", 8)
      .attr("fill", "#FF5733");

    svg.selectAll(".airport-label")
      .data(result.route)
      .enter()
      .append("text")
      .attr("x", (_, i) => xScale(result.route[i]))
      .attr("y", (_, i) => yPositions[i] - 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .style("font-weight", "bold")
      .style("font-size", "16px")
      .text((d) => d);
  }, [result]);

  const openGoogleMaps = () => {
    if (result?.route?.length > 0) {
      const query = result.route.join(" to ");
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: { xs: 2, sm: 3 } }}>
      <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)} centered>
        <Tab label="Search Flights" />
        <Tab label="Flight Route Map" disabled={!result} />
      </Tabs>

      {tabIndex === 0 && (
        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3, minHeight: "auto" }}>
          <Typography variant="h4" align="center" gutterBottom>
            <TravelExploreIcon sx={{ fontSize: 40, color: "#007BFF" }} /> Flight Route Finder
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField fullWidth label="Origin" variant="outlined" value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
              InputProps={{ startAdornment: <FlightTakeoffIcon color="primary" /> }} 
            />
            <TextField fullWidth label="Destination" variant="outlined" value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              InputProps={{ startAdornment: <FlightLandIcon color="secondary" /> }} 
            />
          </Box>

          <Button fullWidth variant="contained" color="primary" onClick={searchFlights} 
            sx={{ py: 1.5, fontSize: "1rem", fontWeight: "bold", mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Find Route"}
          </Button>

          {error && <Typography variant="body1" color="error" sx={{ mt: 2, fontWeight: "bold" }}>❌ {error}</Typography>}
        </Paper>
      )}

      {tabIndex === 1 && result?.route?.length > 0 && (
        <Paper sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: 2, bgcolor: "#f9f9f9" }}>
          <Typography variant="h6" fontWeight="bold">Optimal Route:</Typography>
          <Typography variant="body1" sx={{ fontSize: "1.1rem", fontWeight: "bold", color: "#007BFF" }}>
            {result.route.join(" ✈️ ")}
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", overflowX: "auto" }}>
            <svg ref={svgRef} />
          </Box>

          {/* Google Maps Button */}
          <Button fullWidth variant="contained" color="secondary" sx={{ mt: 2, py: 1.5, fontSize: "1rem", fontWeight: "bold" }} onClick={openGoogleMaps}>
            🌍 Show in Google Maps
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default FlightSearch;
