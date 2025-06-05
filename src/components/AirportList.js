import { useState, useEffect } from 'react';
import { useLocation } from '../components/LocationProvider';

const API_KEY = process.env.REACT_APP_AVIATIONSTACK_KEY ?? '';

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const AirportList = () => {
  const { location, loading, error } = useLocation();
  const [allAirports, setAllAirports] = useState([]);
  const [airports, setAirports] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [flights, setFlights] = useState([]);
  const [airportError, setAirportError] = useState(null);
  const [flightLoading, setFlightLoading] = useState(false);
  const [radius, setRadius] = useState(100);


  useEffect(() => {
    const fetchAirports = async () => {
      if (!location || !API_KEY) return;

      try {
        const res = await fetch(
          `https://api.aviationstack.com/v1/airports?access_key=${API_KEY}&country_name=${encodeURIComponent(location.country)}`
        );
        const data = await res.json();

        if (data.data?.length > 0) {
          setAllAirports(data.data);
          setAirportError(null);
        } else {
          setAllAirports([]);
          setAirportError(`No airports found for ${location.city}.`);
        }
      } catch (err) {
        setAllAirports([]);
        setAirportError('Failed to fetch airport data.');
      }
    };

    fetchAirports();
  }, [location]);

  useEffect(() => {
    if (!location || !allAirports.length) return;

    const filtered = allAirports.filter((airport) => {
      if (!airport.latitude || !airport.longitude) return false;

      const dist = haversineDistance(
        location.lat,
        location.lon,
        airport.latitude,
        airport.longitude
      );

      return dist <= radius;
    });

    setAirports(filtered);
    setSelectedAirport(filtered[0] ?? null);

    if (filtered.length === 0) {
      setAirportError(`No airports found within ${radius} km of ${location.city}.`);
    } else {
      setAirportError(null);
    }
  }, [radius, allAirports, location]);


  useEffect(() => {
    const fetchFlights = async () => {
      if (!selectedAirport?.iata_code || !API_KEY) return;

      setFlightLoading(true);
      try {
        const res = await fetch(
          `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${selectedAirport.iata_code}`
        );
        const data = await res.json();
        setFlights(data.data?.slice(0, 10) ?? []);
      } catch (err) {
        console.error('Failed to fetch flight data:', err);
        setFlights([]);
      } finally {
        setFlightLoading(false);
      }
    };

    fetchFlights();
  }, [selectedAirport]);

  if (!API_KEY) return <p>Error: Missing AviationStack API key.</p>;
  if (loading) return <p>Loading your location...</p>;
  if (error) return <p>Error: {error}</p>;
  if (airportError) return <p>{airportError}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>
        Airports near {location?.city}, {location?.country} ({airports.length})
      </h2>

     
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="radius">Filter radius: </label>
        <select
          id="radius"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        >
          {[50, 70, 100, 120, 250, 500, 1000].map((r) => (
            <option key={r} value={r}>
              {r} km
            </option>
          ))}
        </select>
      </div>

 
      <div style={{ display: 'flex', gap: '10px', margin: '10px 0', flexWrap: 'wrap' }}>
        {airports.map((airport) => (
          <button
            key={`${airport.iata_code || 'no-code'}-${airport.airport_name}`}
            onClick={() => setSelectedAirport(airport)}
            style={{
              padding: '8px 12px',
              backgroundColor:
                selectedAirport?.iata_code === airport.iata_code ? '#007bff' : '#f0f0f0',
              color:
                selectedAirport?.iata_code === airport.iata_code ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {airport.airport_name}
          </button>
        ))}
      </div>

      {/* Airport Info */}
      {selectedAirport && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3>{selectedAirport.airport_name}</h3>
          <p><strong>IATA:</strong> {selectedAirport.iata_code || 'N/A'}</p>
          <p><strong>ICAO:</strong> {selectedAirport.icao_code || 'N/A'}</p>
          <p><strong>City:</strong> {selectedAirport.city || 'N/A'}</p>
          <p><strong>Country:</strong> {selectedAirport.country_name || 'N/A'}</p>
        </div>
      )}

      {/* Real-time Flight Info */}
      {selectedAirport && (
        <div style={{ marginTop: '30px' }}>
          <h4>Live Departures from {selectedAirport.iata_code}</h4>
          {flightLoading ? (
            <p>Loading flights...</p>
          ) : flights.length === 0 ? (
            <p>No real-time flight data available.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Flight</th>
                    <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Airline</th>
                    <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>To</th>
                    <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight) => (
                    <tr
                      key={`${flight.flight?.iata || 'unknown'}-${flight.departure?.scheduled || flight.flight?.number || Math.random()}`}
                    >
                      <td>{flight.flight?.iata || 'N/A'}</td>
                      <td>{flight.airline?.name || 'N/A'}</td>
                      <td>{flight.arrival?.iata || 'N/A'}</td>
                      <td>{flight.flight_status || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AirportList;
