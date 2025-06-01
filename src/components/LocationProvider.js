import { createContext, useContext, useEffect, useState } from 'react';

const LocationContext = createContext();
export const useLocation = () => useContext(LocationContext);

const hardcodedLocations = [
 {
  city: 'London',
  region: 'England',
  country: 'United Kingdom',
  lat: 51.5074,
  lon: -0.1278,
  ip: 'Hardcoded-London',
}

];

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hardcodedLocations.length === 0) {
      setError('No locations available.');
      setLoading(false);
      return;
    }

    setLocation(hardcodedLocations[0]);
    setLoading(false);
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, error }}>
      {children}
    </LocationContext.Provider>
  );
};
