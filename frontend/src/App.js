import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup"; 
import AdminSignup from "./pages/AdminSignup"; 
import MemberSignup from "./pages/MemberSignup"; 
import UserSignup from "./pages/UserSignup"; 
import Login from "./pages/Login"; 
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

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Always visible */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* ✅ Home page */}
        <Route path="/login" element={<Login />} />
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
        


      </Routes>
    </Router>
  );
}

export default App;
