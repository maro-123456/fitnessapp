import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Exercises from "./pages/Exercises";
import NutritionPlans from "./pages/NutritionPlans";
import ProgressChart from "./pages/ProgressChart";
import Profile from "./pages/Profile";
import GymMap from "./pages/GymMap";
import EmailCoaching from "./pages/EmailCoaching";
import TestPage from "./pages/TestPage";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<TestPage />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="exercises" element={<Exercises />} />
              <Route path="nutrition" element={<NutritionPlans />} />
              <Route path="gyms" element={<GymMap />} />
              <Route path="emails" element={<EmailCoaching />} />
              <Route path="progress" element={<ProgressChart />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
