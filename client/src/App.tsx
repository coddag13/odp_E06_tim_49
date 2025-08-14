import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import KatalogStranica from "./pages/catalog/KatalogStranica";
import RegistracijaStranica from "./pages/auth/RegistracijaStranica";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import PrikazNeprijavljenih from "./pages/prikaz/PrikazNeprijavljenihKorisnika"; 


function App() {
  return (
    <Routes>
      <Route path="/" element={<PrikazNeprijavljenih />} />
      <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaStranica authApi={authApi} />} />
      <Route path="/404" element={<NotFoundStranica />} />

       <Route path="/catalog" element={<KatalogStranica />} />
        {/* Preusmerava na dashboard kao default rutu */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all ruta za nepostojeće stranice */}
        <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
