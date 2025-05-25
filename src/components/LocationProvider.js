
import { createContext, useContext, useEffect, useState } from 'react';

const LocationContext = createContext();
export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://ip-api.com/json/');
      if (!res.ok) throw new Error('Failed to fetch location');

      const data = await res.json();

      if (data.status === 'success') {
        const ipData = {
          ip: data.query,
          city: data.city,
          region: data.regionName,
          country: data.country,
          lat: data.lat,
          lon: data.lon,
        };
        console.log(ipData);
        setLocation(ipData);
      } else {
        setError('Could not retrieve location');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider value={{  loading, error }}>
      {children}
    </LocationContext.Provider>
  );
};
