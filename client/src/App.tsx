import { Routes, Route, Navigate } from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import RegistracijaStranica from "./pages/auth/RegistracijaStranica";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import PrikazNeprijavljenih from "./pages/prikaz/PrikazNeprijavljenihKorisnika";
import PrikazPrijavljenih from "./pages/prikaz/PrikazPrijavljenihKorisnika";

function useAuthLike() {
  const token = localStorage.getItem("token") ?? "";
  return { token, isLoggedIn: Boolean(token) };
}

function App() {
 const { isLoggedIn } = useAuthLike();

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <PrikazPrijavljenih /> : <PrikazNeprijavljenih />} />
      <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaStranica authApi={authApi} />} />
      <Route path="/404" element={<NotFoundStranica />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
