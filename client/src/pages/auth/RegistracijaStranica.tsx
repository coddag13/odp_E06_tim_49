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
    <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/90 backdrop-blur p-8 shadow-2xl">
          <RegistracijaForma authApi={authApi} />
        </div>
        <p className="mt-3 text-center text-sm text-slate-400">
          Kreirajte nalog da nastavite
        </p>
      </div>
    </main>
  );
}
