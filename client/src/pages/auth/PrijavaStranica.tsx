import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PrijavaForma } from "../../components/auth/PrijavaForma";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";

interface LoginPageProps {
  authApi: IAuthAPIService;
}

export default function PrijavaStranica({ authApi }: LoginPageProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user)
      //navigate(`/${user.uloga}-dashboard`);
    navigate("/prikaz");
  }, [isAuthenticated, navigate, user]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-amber-50/90 via-yellow-50/90 to-emerald-100/90 flex items-center justify-center">
      <PrijavaForma authApi={authApi} />
    </main>
  );
}
