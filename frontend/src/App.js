import  { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import EditProfile from './pages/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import CarInsurance from './pages/carInsurance';
import BikeInsurance from './pages/bikeInsurance';
import HealthInsurance from './pages/healthinsurance';
import LifeInsurance from './pages/LifeInsurnace';
import PremiumDetails from './pages/CheckPremium';
import QuotePage from './pages/HealthQuote';
import AdminDashboard from './pages/AdminDashboard';
import PolicyManagement from './components/admin/PolicyManagement';
import PolicyForm from './components/PolicyForm';
import AdvisorManagement from './components/admin/AdvisorManagement';
import UserManagement from './pages/UserManagement';
import UserDetail from './components/admin/UserDetail';
import AdvisorsPage from './pages/Advisor'
import DashboardView from './pages/AdminDashboardView';
import DownloadPolicyPage from './pages/DownloadPolicyPage';
import CarInsuranceNews from './pages/CarInsuranceNews';
import BikeInsuranceNews from './pages/BikeInsuranceNews';
import HealthInsuranceNews from './pages/HealthnsuranceNews';
import TermInsurance from './pages/TermInsurnace'
import POSPAgentPage from './pages/POSPagent'
import TermInsuranceNews from './pages/TermInsuranceNews'
import LifeInsuranceNews from './pages/LifeInsurnaceNews';


function App() {
  const {  isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Updated dashboard route */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            {isAdmin ? <Navigate to="/admin/dashboard" /> : <UserDashboard />}
          </PrivateRoute>
        } 
      />
      
      <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
      <Route path="/advisors" element={<AdvisorsPage />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            {isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" />}
          </PrivateRoute>
        }
      >
      <Route index element={<DashboardView />} />
        <Route path="dashboard" element={<DashboardView />} />
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
      <Route path="/life-insurance" element={<LifeInsurance />} />
       <Route path="/term-insurance" element={<TermInsurance />} />
      <Route path="/check-premium" element={<PremiumDetails />} />
      <Route path="/health-quote" element={<QuotePage />} />
      <Route path="/become-agent" element={<POSPAgentPage />} />
      <Route path="/car-insurance/news" element={<CarInsuranceNews />} />
      <Route path="/bike-insurance/news" element={<BikeInsuranceNews />} />
      <Route path="/Health-insurance/news" element={<HealthInsuranceNews />} />
      <Route path="/term-insurance/news" element={<TermInsuranceNews />} />
      <Route path="/life-insurance/news" element={<LifeInsuranceNews />} />

      <Route path="/download" element={<DownloadPolicyPage />} />
    </Routes>
  );
}

export default App;