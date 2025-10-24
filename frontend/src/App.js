import logo from './logo.svg';
import './App.css';
import TripsUI from './components/TripUI';
import NavBar from './components/NavBar';
import TripCard from './components/dashboard/TripCard';
import TripList from './components/dashboard/TripList';

function App() {
  const trip_id = 2; 
  return (
    <div className="App">
      <NavBar />
      {/* <TripsUI trip_id={trip_id} /> */}
      <TripCard trip_id={trip_id} />
      <TripList trips={[]} />

    </div>
  );
}

export default App;
