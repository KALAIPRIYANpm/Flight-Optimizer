import { BrowserRouter, Routes, Route } from "react-router-dom";
import FlightSearch from "./FlightSearch";
import CityMap from "./CityMap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FlightSearch />} />
        <Route path="/map" element={<CityMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
