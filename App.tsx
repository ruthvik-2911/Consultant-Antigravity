import React, { useState, createContext, useContext, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserRole, User } from "./types";
import { auth } from "./services/api";
import { ToastProvider } from "./context/ToastContext";

// ---------------- PAGES ----------------
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import SearchConsultantPage from "./pages/user/SearchConsultantPage";
import UserCredit from "./pages/user/UserCredit";
import UserBooking from "./pages/user/UserBooking";
import UserProfilePage from "./pages/user/UserProfilePage";
import UserSupportPage from "./pages/user/UserSupportPage";

// Shared Pages
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import BookingsPage from "./pages/BookingsPage";

// Consultant Pages
import ConsultantDashboard from "./pages/ConsultantDashboard";
import AvailabilityPage from "./pages/AvailabilityPage";
import EarningsPage from "./pages/EarningsPage";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, role?: UserRole) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ---------------- LOGIN ----------------
  const login = async (email: string, role?: UserRole) => {
    setLoading(true);
    try {
      const userData = await auth.login(email, role);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ---------------- RESTORE SESSION ----------------
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const isUser = user?.role === UserRole.USER;

  const isConsultant =
    user?.role === UserRole.CONSULTANT ||
    user?.role === UserRole.ENTERPRISE_ADMIN;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Restoring session...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
        <Router>
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Navigate to="/login" />} />
            <Route path="/login" element={<AuthPage type="LOGIN" />} />
            <Route path="/signup" element={<AuthPage type="SIGNUP" />} />

            {/* ---------------- USER ROUTES ---------------- */}
            <Route
              path="/user/dashboard"
              element={isUser ? <UserDashboard /> : <Navigate to="/auth" />}
            />
            <Route
              path="/user/search"
              element={isUser ? <SearchConsultantPage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/user/bookings"
              element={isUser ? <UserBooking /> : <Navigate to="/auth" />}
            />
            <Route
              path="/user/credits"
              element={isUser ? <UserCredit /> : <Navigate to="/auth" />}
            />
            <Route
              path="/user/wallet"
              element={isUser ? <UserCredit /> : <Navigate to="/auth" />}
            />
            <Route
              path="/user/messages"
              element={isUser ? <MessagesPage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/user/profile"
              element={isUser ? <UserProfilePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/user/support"
              element={isUser ? <UserSupportPage /> : <Navigate to="/auth" />}
            />

            {/* ---------------- CONSULTANT ROUTES ---------------- */}
            <Route
              path="/consultant/dashboard"
              element={isConsultant ? <ConsultantDashboard /> : <Navigate to="/auth" />}
            />
            <Route
              path="/consultant/bookings"
              element={isConsultant ? <BookingsPage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/consultant/messages"
              element={isConsultant ? <MessagesPage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/consultant/slots"
              element={isConsultant ? <AvailabilityPage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/consultant/earnings"
              element={isConsultant ? <EarningsPage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/consultant/profile"
              element={isConsultant ? <ProfilePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/consultant/enterprise"
              element={isConsultant ? <EnterpriseDashboard /> : <Navigate to="/auth" />}
            />

            {/* SHARED PROFILE */}
            <Route
              path="/profile"
              element={user ? <ProfilePage /> : <Navigate to="/auth" />}
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </Router>
      </AuthContext.Provider>
    </ToastProvider>
  );
};

export default App;
