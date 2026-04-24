import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");

  const handleVerify = async () => {
    try {
      const res = await API.post("/auth/verify-otp", {
        userId,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/todo");
    } catch (err) {
      console.log(err);
      alert("Invalid OTP");
    }
  };

    return (
    <div className="auth-page">
        <div className="bg-blob purple"></div>
        <div className="bg-blob blue"></div>

        <div className="auth-card otp-card">
        <h2>Verify OTP</h2>

        <p className="otp-subtext">
            Enter the 6-digit code sent to your email
        </p>

        <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
        />

        <button className="btn primary" onClick={handleVerify}>
            Verify
        </button>
        </div>
    </div>
    );
}