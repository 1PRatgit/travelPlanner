import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import UserSignup from './components/user/UserSignup';
import UserLogin from './components/user/UserLogin';
import UserProfile from './components/user/UserProfile';
import TripList from './components/trips/TripList';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import SeasonalDeals from './pages/SeasonalDeals';
import Connect from './pages/Connect';
import Feedback from './pages/FeedBack';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/trips" element={<PrivateRoute><TripList /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/SeasonalDeals" element={<SeasonalDeals />} />
          <Route path="/ConnectWithTravelers" element={<Connect />} />
          <Route path="/Feedback" element={<Feedback />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
