import NavBar from "../components/NavBar";
export default function Connect() {
    return (
        <div style={{ backgroundColor: "#fff5fa", minHeight: "100vh" }}>
            <NavBar userActive={false} />
            <div className="container py-5">
              <h1 className="fw-bold mb-4" style={{ color: "#c2185b", fontSize: "3rem" }}>
                    Connect with Travelers
                </h1>
            <div className="container py-5">
                <p className="mb-4" style={{ color: "#666", fontSize: "1.1rem" }}>
                    Share your travel experiences, tips, and itineraries with a community of passionate travelers. Whether you're seeking advice for your next trip or looking to inspire others with your adventures, our platform is the perfect place to connect and collaborate.
                </p>
                {/* Add more content about connecting with travelers here */}
            </div>
            </div>
        </div>
    );
}