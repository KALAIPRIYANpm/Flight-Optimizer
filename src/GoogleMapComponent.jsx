import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const GoogleMapComponent = ({ city }) => {
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    if (!city) return;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0]?.lat),
            lng: parseFloat(data[0]?.lon),
          });
        }
      });
  }, [city]);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      {coordinates ? (
        <GoogleMap mapContainerStyle={containerStyle} center={coordinates} zoom={10}>
          <Marker position={coordinates} />
        </GoogleMap>
      ) : (
        <p>Loading Google Map...</p>
      )}
    </LoadScript>
  );
};

export default GoogleMapComponent;
