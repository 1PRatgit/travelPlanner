import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserCreate from "../../hooks/useUserCreate";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { createUser, loading, message } = useUserCreate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createUser(formData);
      setFormData({ name: "", email: "", password: "" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff5fa",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container">
        <div
          className="card shadow-sm border-0"
          style={{ borderRadius: "10px", maxWidth: "450px", margin: "0 auto" }}
        >
          <div
            className="card-header text-center"
            style={{
              backgroundColor: "#fff",
              borderBottom: "2px solid #ffd6e8",
            }}
          >
            <h3 className="fw-bold mb-0" style={{ color: "#c2185b" }}>
              📝 Create Account
            </h3>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              name="username" // ⭐️ Added input name
              value={formData.username} // ⭐️ Bind value
              onChange={handleChange}
              placeholder="Choose a unique username"
              required
            />
          </div>
          <div className="card-body px-4 py-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full name</label>
                <input
                  type="text"
                  className="form-control"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn fw-semibold w-100"
                disabled={loading}
                style={{
                  backgroundColor: "#ffd6e8",
                  border: "1px solid #ffb6c1",
                  color: "#333",
                  padding: "10px",
                }}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {message && (
              <div
                className={`alert mt-3 ${
                  message.type === "success" ? "alert-success" : "alert-danger"
                }`}
              >
                {message.text}
              </div>
            )}

            <hr className="my-3" style={{ borderColor: "#ffd6e8" }} />

            <p className="text-center text-muted">
              Already have an account?{" "}
              <a href="/login" style={{ color: "#c2185b", fontWeight: "bold" }}>
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
