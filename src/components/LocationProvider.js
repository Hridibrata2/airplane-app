import { createContext, useContext, useEffect, useState } from 'react';

const LocationContext = createContext();
export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();

        if (data.status === 'success') {
          setLocation({
            city: data.city,
            region: data.regionName,
            country: data.country,
            lat: data.lat,
            lon: data.lon,
            ip: data.query,
          });
        } else {
          throw new Error('Failed to fetch location');
        }
      } catch (err) {
        console.error('Error fetching location:', err);
        setError('Could not fetch location');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, error }}>
      {children}
    </LocationContext.Provider>
  );
};
