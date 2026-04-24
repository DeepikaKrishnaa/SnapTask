import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Todo from "./pages/Todo";
import Otp from "./pages/Otp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/todo" element={<Todo />} />
    </Routes>
  );
}

export default App;