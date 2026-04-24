import { useState, useEffect } from "react";
import "./../styles/auth.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { login, register } from "../services/auth";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  const [isLogin, setIsLogin] = useState(mode !== "signup");

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async () => {
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      return setError("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Invalid email format");
    }

    if (password.length < 5 || password.length > 20) {
      return setError("Password must be 5-20 characters");
    }

    if (!isLogin && password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = isLogin
        ? await login({ email, password })
        : await register({ name, email, password });

        if (isLogin) {
          navigate(`/otp?userId=${res.data.userId}`);
        } else {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/todo");
        }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://3.110.143.145:30007/api/auth/google";
  };

  return (
    <div className="auth-page">
      <div className="bg-blob purple"></div>
      <div className="bg-blob blue"></div>

      <div className="auth-card" key={isLogin ? "login" : "signup"}>
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {error && <p className="error-text">{error}</p>}

        <button className="btn primary" onClick={handleSubmit}>
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <button className="btn primary" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <p className="toggle-text">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <span onClick={() => setIsLogin(false)}>Sign up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}