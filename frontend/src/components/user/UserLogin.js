import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserLogin from '../../hooks/useUserLogin';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    username: '', 
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, loading, message } = useUserLogin(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData.username, formData.password);
      setFormData({ username: '', password: '' });
      setTimeout(() => navigate('/profile'), 500);
      
    } catch (err) {
      setError(message?.text || 'Login attempt failed.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0" style={{ borderRadius: "10px", maxWidth: "400px", margin: "0 auto" }}>
        <div
          className="card-header text-center"
          style={{
            backgroundColor: "#fff",
            borderBottom: "2px solid #ffd6e8",
          }}
        >
          <h3 className="fw-bold mb-0" style={{ color: "#c2185b" }}>
            🔐 Login
          </h3>
        </div>

        <div className="card-body px-4 py-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input
                type="text" // Changed type from string to text (better semantic HTML)
                className="form-control"
                name="username" // ⭐️ CHANGE 3: Set input name to 'username'
                value={formData.username} // ⭐️ CHANGE 4: Bind value to formData.username
                onChange={handleChange}
                placeholder="Enter username or email"
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
                placeholder="Password"
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
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Display general component error state if hook fails unexpectedly */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          
          {/* Display messages handled by the useUserLogin hook */}
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
            Don't have an account?{' '}
            <a href="/signup" style={{ color: "#c2185b", fontWeight: "bold" }}>
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;