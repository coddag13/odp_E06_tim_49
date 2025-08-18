import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegistracijaForma } from "../../components/auth/RegistracijaForma";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";

interface RegistracijaPageProps {
  authApi: IAuthAPIService;
}
export default function RegistracijaStranica({ authApi }: RegistracijaPageProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      navigate("/katalog", { replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-amber-100/80 via-yellow-50/80 to-emerald-100/80 flex items-center justify-center">
      <RegistracijaForma authApi={authApi} />
    </main>
  );
}
