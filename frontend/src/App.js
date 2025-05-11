
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { useAuth } from './context/AuthContext';
  import PrivateRoute from './components/PrivateRoute';
  import Home from './pages/Home';
  import Login from './pages/Login';
  import Register from './pages/Register';
  import UserDashboard from './pages/UserDashboard';
  import EditProfile from './pages/EditProfile';
  import ForgotPassword from './pages/ForgotPassword';
  import ResetPassword from './pages/ResetPassword';
  import CarInsurance from './pages/carInsurance';
  import BikeInsurance from './pages/bikeInsurance';
  import HealthInsurance from './pages/healthinsurance';
  import LifeInsurance from './pages/lifeInsurance';
  import TermInsurance from './pages/termInsurance';
  import PremiumDetails from './pages/CheckPremium';
  import QuotePage from './pages/HealthQuote';
  import AdminDashboard from './pages/AdminDashboard';
  import PolicyManagement from './components/admin/PolicyManagement';
  import PolicyForm from './components/PolicyForm';
  import AdvisorManagement from './components/admin/AdvisorManagement';
  import UserManagement from './pages/UserManagement';
  import UserDetail from './components/admin/UserDetail';
  import AdvisorsPage from './pages/Advisor'


  function App() {
    const { isAuthenticated, isAdmin } = useAuth();

    return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/advisors" element={<AdvisorsPage />} />

        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<div>Welcome to Admin Dashboard</div>} />
          <Route path="policies" element={<PolicyManagement />} />
          <Route path="policies/new" element={<PolicyForm />} />
          <Route path="policies/edit/:id" element={<PolicyForm />} />
          <Route path="advisors" element={<AdvisorManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/:id" element={<UserDetail />} />
        </Route>


        <Route path="/car-insurance" element={<CarInsurance />} />
        <Route path="/bike-insurance" element={<BikeInsurance />} />
        <Route path="/health-insurance" element={<HealthInsurance />} />
        <Route path="/check-premium" element={<PremiumDetails />} />
        <Route path="/health-quote" element={<QuotePage />} />
        <Route path="/term-insurance" element={<TermInsurance />} />
        <Route path="admin/users" element={<UserManagement />} />
        <Route path="admin/users/:id" element={<UserDetail />} />

      </Routes>
    );
  }


  export default App;
