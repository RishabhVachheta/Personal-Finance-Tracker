import React, { useState } from "react";
import { useNavigate, Link  } from "react-router-dom";
import { login } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./css/AuthForm.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login: loginUser } = React.useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await login(formData);
      loginUser(data.user, data.token);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); 
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Login</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button className="auth-button" type="submit">
          Login
        </button>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
