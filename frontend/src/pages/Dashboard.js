import NavBar from "../components/NavBar";
import TripList from "../components/dashboard/TripList";

function Dashboard() {
  return (
    <div className="Dashboard">
      <NavBar />
      <div 
        className="container-fluid py-5" 
        style={{ 
          maxWidth: "1200px", 
          margin: "0 auto",
          padding: "0 48px",
          backgroundColor: "#fff",
          minHeight: "calc(100vh - 60px)" // Assumes navbar is 60px high
        }}
      >
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4 fw-bold">My Trips</h2>
            <TripList trips={[]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;