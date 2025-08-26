import { Routes, Route, Navigate } from "react-router-dom";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import RegistracijaStranica from "./pages/auth/RegistracijaStranica";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import { authApi } from "./api_services/auth/AuthAPIService";
import AddContentPage from "./pages/prikaz/AddContentPage";
import KatalogPage from "./pages/prikaz/KatalogPage";
import { contentApi } from "./api_services/content/ContentAPIService";


export default function App() {
  return (
    <Routes>
      {/* Katalog — prikazuje i prijavljenima i neprijavljenima */}
      <Route path="/" element={<KatalogPage />} />
      <Route path="/katalog" element={<KatalogPage />} />

      {/* Auth */}
      <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaStranica authApi={authApi} />} />

      {/* Admin može dodavati sadržaj */}
      <Route
        path="/admin/content/new"
        element={
          <ProtectedRoute requiredRole="admin">
            <AddContentPage contentApi={contentApi} />
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="/404" element={<NotFoundStranica />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}