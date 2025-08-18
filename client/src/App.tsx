import { Routes, Route, Navigate } from "react-router-dom";
import PrikazNeprijavljenih from "./pages/prikaz/PrikazNeprijavljenihKorisnika";
import PrikazPrijavljenih from "./pages/prikaz/PrikazPrijavljenihKorisnika";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import RegistracijaStranica from "./pages/auth/RegistracijaStranica";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import { authApi } from "./api_services/auth/AuthAPIService";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PrikazNeprijavljenih />} />

      <Route
        path="/katalog"
        element={
          <ProtectedRoute>
            <PrikazPrijavljenih />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaStranica authApi={authApi} />} />

      
      <Route
        path="/user-prikaz"
        element={
          <ProtectedRoute requiredRole="user">
            <PrikazPrijavljenih />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-prikaz"
        element={
          <ProtectedRoute requiredRole="admin">
            <PrikazPrijavljenih />
          </ProtectedRoute>
        }
      />

      <Route path="/404" element={<NotFoundStranica />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
