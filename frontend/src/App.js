import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Signup from "./pages/Signup"; 
import AdminSignup from "./pages/AdminSignup"; 
import MemberSignup from "./pages/MemberSignup"; 
import UserSignup from "./pages/UserSignup"; 
import Login from "./pages/Login"; 
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile"; 
import Markets from "./pages/Markets"; 
import Navbar from "./components/Navbar"; 
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import UserDashboard from "./pages/UserDashboard";
import CryptoGraph from "./CryptoGraph";
import CryptoComparator from "./pages/CryptoComparator";
import CryptoList from "./pages/CryptoList";
import CoinGraph from "./pages/CoinGraph";
import CompareGraph from "./pages/CompareGraph";
import GeminiRecommendations from "./pages/GeminiRecommendations";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/admin" element={<AdminSignup />} />
          <Route path="/signup/member" element={<MemberSignup />} />
          <Route path="/signup/user" element={<UserSignup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/graph/:coinName" element={<CryptoGraph />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/MemberDashboard" element={<MemberDashboard />} />
          <Route path="/compare" element={<CryptoComparator />} />
          <Route path="/cryptos" element={<CryptoList />} />
          <Route path="/coin/:id" element={<CoinGraph />} />
          <Route path="/compare-graph" element={<CompareGraph />} />
          <Route path="/gemini-recommendations" element={<GeminiRecommendations />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
