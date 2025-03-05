import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Paper, Tabs, Tab, Button } from "@mui/material";
import GoogleMapComponent from "./GoogleMapComponent";

const CityMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coordinates, setCoordinates] = useState(null);
  const [showGoogleMap, setShowGoogleMap] = useState(false);
  const city = new URLSearchParams(location.search).get("city");

  useEffect(() => {
    if (!city) return;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
      .then(res => res.json())
      .then(data => setCoordinates([data[0]?.lat, data[0]?.lon]));
  }, [city]);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Tabs value={1} onChange={(e, newValue) => navigate(newValue === 0 ? "/" : "/map")}>
        <Tab label="Flight Search" />
        <Tab label="Map" />
      </Tabs>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5">Map of {city}</Typography>

        {coordinates && (
          <MapContainer center={coordinates} zoom={10} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={coordinates}>
              <Popup>{city}</Popup>
            </Marker>
          </MapContainer>
        )}

        {/* Google Map Button BELOW the Search Path */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowGoogleMap(!showGoogleMap)}
          >
            {showGoogleMap ? "Hide Google Map" : "Show Google Map"}
          </Button>
        </Box>

        {/* Google Map Renders Below When Button Clicked */}
        {showGoogleMap && <GoogleMapComponent city={city} />}
      </Paper>
    </Box>
  );
};

export default CityMap;
