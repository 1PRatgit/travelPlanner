import NavBar from "../components/NavBar";
export default function SeasonalDeals() {

    return (
        <div style={{ backgroundColor: "#fff5fa", minHeight: "100vh" }}>
            <NavBar userActive={false} />
            <div className="container py-5">
                <h1 className="fw-bold mb-4" style={{ color: "#c2185b", fontSize: "3rem" }}>
                    Seasonal Deals
                </h1>
                <p className="mb-4" style={{ color: "#666", fontSize: "1.1rem" }}>
                    Explore our exclusive seasonal deals to make your travel dreams come true! Whether you're looking for a winter getaway or a summer adventure, we have special offers tailored just for you.
                </p>
                {/* Add more content about seasonal deals here */}
            </div>
        </div>
    );

}