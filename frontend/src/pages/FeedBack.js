import NavBar from "../components/NavBar";
export default function Feedback() {
    return (
        <div style={{ backgroundColor: "#fff5fa", minHeight: "100vh" }}>
            <NavBar userActive={false} />
            <div className="container py-5">
                <h1 className="fw-bold mb-4" style={{ color: "#c2185b", fontSize: "3rem" }}>
                    Feedback
                </h1>
                <p className="mb-4" style={{ color: "#666", fontSize: "1.1rem" }}>
                    We value your feedback! Please let us know about your experience using our travel planning platform. Your insights help us improve and provide better services to all travelers.
                </p>
                {/* Add more content about feedback here */}
            </div>
        </div>
    );
}