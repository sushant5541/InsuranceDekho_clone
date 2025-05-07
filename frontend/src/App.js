import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/UserDashboard';
import EditProfile from './pages/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CarInsurance from './pages/carInsurance';
import BikeInsurance from './pages/bikeInsurance';
import HealthInsurance from './pages/healthinsurance'
import LifeInsurance from './pages/lifeInsurance'
import TermInsurance from './pages/termInsurance'
import RenewAuth from './pages/RenewAuth';
import PremiumDetails from './pages/CheckPremium';
import QuotePage from './pages/HealthQuote';

function App() {
  return (
    <div>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          <Route path="/car-insurance" element={<CarInsurance />} />
          <Route path="/bike-insurance" element={<BikeInsurance />} />
          <Route path="/health-insurance" element={<HealthInsurance />} />
          <Route path="/Renew" element={<RenewAuth />} />
          <Route path="/check-premium" element={<PremiumDetails />} />
          <Route path="/health-quote" element={<QuotePage/>} />
          <Route path="/term-insurance" element={<TermInsurance />} />
        </Routes>
      </Router>
    </AuthProvider>
    </div>
  );
}

export default App;
