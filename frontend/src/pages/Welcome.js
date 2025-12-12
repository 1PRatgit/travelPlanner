import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';

const features = [
  { icon: "📋", title: "Easy Planning", description: "Create detailed day-by-day itineraries for your trips" },
  { icon: "🚗", title: "Track Transport", description: "Log flights, trains, and road trips in one place" },
  { icon: "💰", title: "Budget Control", description: "Keep track of activity costs and trip expenses" },
  { icon: "✅", title: "Activity Tracking", description: "Mark activities as complete and stay organized" },
];

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ backgroundColor: "#fff5fa", minHeight: "100vh" }}>
      <NavBar userActive={false} />
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <h1 className="fw-bold mb-4" style={{ color: "#c2185b", fontSize: "3rem" }}>
              Plan Your Perfect Trip
            </h1>
            <p className="mb-4" style={{ color: "#666", fontSize: "1.1rem" }}>
              Organize your travels with ease. Create detailed itineraries, track activities,
              and make the most of every moment of your adventure.
            </p>

            <div className="d-flex gap-3">
              {!user &&(
                <>
                  <button className="btn fw-semibold px-4 py-2" style={{ backgroundColor: "#ffd6e8", border: `1px solid ${"#ffb6c1"}`, color: "#333", fontSize: "1rem" }} onClick={() => navigate('/signup')}>Get Started</button>
                  <button className="btn fw-semibold px-4 py-2" style={{ backgroundColor: "transparent", border: `2px solid ${"#ffd6e8"}`, color: "#c2185b", fontSize: "1rem" }} onClick={() => navigate('/login')}>Login</button>
                </>
              ) }
            </div>
          </div>

          <div className="col-lg-6 text-center">
            <div style={{ backgroundColor: "#fff", borderRadius: "15px", padding: "40px", boxShadow: "0 4px 20px rgba(255, 105, 180, 0.15)" }}>
              <div style={{ fontSize: "5rem", marginBottom: "20px" }}>🌍✈️🗺️</div>
              <p style={{ color: "#999", fontSize: "1.1rem" }}>Make every journey memorable</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#fff", borderTop: `2px solid ${"#ffd6e8"}`, borderBottom: `2px solid ${"#ffd6e8"}`, padding: "60px 0" }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-5" style={{ color: "#c2185b", fontSize: "2rem" }}>Why Choose Travel Planner?</h2>
          <div className="row">
            {features.map((feature, idx) => (
              <div key={idx} className="col-md-6 col-lg-3 mb-4">
                <div className="text-center p-4" style={{ backgroundColor: "#fff5fa", borderRadius: "10px", border: `2px solid ${"#ffd6e8"}` }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>{feature.icon}</div>
                  <h5 className="fw-bold mb-2" style={{ color: "#c2185b" }}>{feature.title}</h5>
                  <p className="text-muted small">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3" style={{ color: "#c2185b" }}>Ready to Start Your Adventure?</h2>
        <p className="text-muted mb-4">Join thousands of travelers planning their perfect trips</p>
        {!user && (
          <button className="btn fw-semibold px-5 py-2" style={{ backgroundColor: "#ffd6e8", border: `1px solid ${"#ffb6c1"}`, color: "#333", fontSize: "1rem" }} onClick={() => navigate('/signup')}>Sign Up Now</button>
        )}
      </div>

      <footer style={{ backgroundColor: "#fff", borderTop: `2px solid ${"#ffd6e8"}`, padding: "30px 0", marginTop: "40px" }}>
        <div className="container text-center">
          <p className="text-muted mb-0">© 2025 Travel Planner. All rights reserved. Made with ❤️</p>
        </div>
      </footer>
    </div>
  );
}
