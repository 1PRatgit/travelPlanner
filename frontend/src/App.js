import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import TripCard from './components/dashboard/TripCard';
import TripList from './components/dashboard/TripList';
import Dashboard from './pages/Dashboard';

function App() {
  const trip_id = 2; 
  return (
    <div className="App">
      <Dashboard />

    </div>
  );
}

export default App;
