import { useState, useEffect } from 'react';
import { useLocation } from './LocationProvider';

const API_KEY = process.env.REACT_APP_AVIATIONSTACK_KEY;

const AirportList = () => {
  const { location, loading, error } = useLocation();
  const [airports, setAirports] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [flights, setFlights] = useState([]);
  const [airportError, setAirportError] = useState(null);
  const [flightLoading, setFlightLoading] = useState(false);

  useEffect(() => {
    const fetchAirports = async () => {
      if (!location) return;

      try {
        const res = await fetch(
          `http://api.aviationstack.com/v1/airports?access_key=${API_KEY}&search=${location.city}`
        );
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setAirports(data.data);
          setSelectedAirport(data.data[0]);
        } else {
          setAirportError('No airports found near your location.');
        }
      } catch (err) {
        setAirportError('Failed to fetch airport data.');
      }
    };

    fetchAirports();
  }, [location]);

  useEffect(() => {
    const fetchFlights = async () => {
      if (!selectedAirport?.iata_code) return;

      setFlightLoading(true);
      try {
        const res = await fetch(
          `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${selectedAirport.iata_code}`
        );
        const data = await res.json();

        if (data.data) {
          setFlights(data.data.slice(0, 10)); 
        } else {
          setFlights([]);
        }
      } catch (err) {
        console.error('Failed to fetch flight data:', err);
        setFlights([]);
      } finally {
        setFlightLoading(false);
      }
    };

    fetchFlights();
  }, [selectedAirport]);

  if (loading) return <p>Loading location...</p>;
  if (error) return <p>Error: {error}</p>;
  if (airportError) return <p>{airportError}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>
        Airports near {location?.city}, {location?.country}
      </h2>

      {/* Airport Tabs */}
      <div style={{ display: 'flex', gap: '10px', margin: '10px 0', flexWrap: 'wrap' }}>
        {airports.map((airport) => (
          <button
            key={airport.iata_code || airport.airport_name}
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
          <p>
            <strong>IATA:</strong> {selectedAirport.iata_code || 'N/A'}
          </p>
          <p>
            <strong>ICAO:</strong> {selectedAirport.icao_code || 'N/A'}
          </p>
          <p>
            <strong>City:</strong> {selectedAirport.city || 'N/A'}
          </p>
          <p>
            <strong>Country:</strong> {selectedAirport.country_name || 'N/A'}
          </p>
        </div>
      )}

      {/* Real-time Flight Info */}
      {selectedAirport && (
        <div style={{ marginTop: '30px' }}>
          <h4>Live Departures from {selectedAirport?.iata_code}</h4>
          {flightLoading ? (
            <p>Loading flights...</p>
          ) : flights.length === 0 ? (
            <p>No real-time flight data available.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
                    Flight
                  </th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
                    Airline
                  </th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
                    To
                  </th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={`${flight.flight.iata}-${flight.departure.estimated}`}>
                    <td>{flight.flight.iata}</td>
                    <td>{flight.airline.name}</td>
                    <td>{flight.arrival?.iata || 'N/A'}</td>
                    <td>{flight.flight_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AirportList;
