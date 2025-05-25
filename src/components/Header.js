import { useLocation } from './LocationProvider';
import './Header.css';

const Header = () => {
  const { location, loading, error } = useLocation();

  return (
    <div className="App-header">
      <div className="title">AeroLocate</div>
      <div className="subtitle">
        {loading && <p>Detecting your location...</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Header;
