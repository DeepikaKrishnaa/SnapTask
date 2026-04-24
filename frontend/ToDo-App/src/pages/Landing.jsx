import "./../styles/landing.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      <div className="bg-blob purple"></div>
      <div className="bg-blob blue"></div>

      <nav className="navbar">
        <h2 className="logo">SNAPTASK</h2>
        <button className="btn primary" onClick={() => navigate("/auth?mode=signup")}>
          Sign Up
        </button>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <h1><span>Get things done in a snap</span></h1>

          <p>
            Plan tasks, add notes, and stay organized — all in one place.
          </p>

          <div className="hero-buttons">
            <button className="btn primary" onClick={() => navigate("/auth?mode=signup")}>
              Get Started
            </button>
            <button className="btn outline" onClick={() => navigate("/auth?mode=login")}>
              Login
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="glass-card floating">
            <p>✔ <s>Finish assignment</s></p>
            <p>✔ <s>Call mom</s></p>
            <p>☐ Read 10 pages</p>
          </div>
        </div>
      </section>

      <section className="features">

        <div className="feature-card">
          <div className="icon">⚡</div>
          <h3>Smart Input</h3>
          <p>Quickly capture tasks without breaking flow.</p>
        </div>

        <div className="feature-card">
          <div className="icon">🎯</div>
          <h3>Deep Focus</h3>
          <p>Eliminate distractions and stay in control.</p>
        </div>

        <div className="feature-card">
          <div className="icon">📝</div>
          <h3>Sticky Notes</h3>
          <p>Keep important ideas always within reach.</p>
        </div>

      </section>

      <footer className="footer">
        <p>DeepikaKrishna</p>
        <p>© 2026 FOCUS-ORGANISE</p>
      </footer>

    </div>
  );
}