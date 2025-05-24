import './App.css';
import Header from './components/Header';
import {LocationProvider} from './components/LocationProvider';
import AirportList from './components/AirportList';

function App() {
  return (
    <div className="App">
      <LocationProvider>
        <Header />
      <AirportList />
      </LocationProvider>
    </div>
  );
}

export default App;
