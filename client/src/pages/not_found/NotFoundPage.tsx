import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";

export default function NotFoundStranica() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleGoHome = () => {
    // Ako želiš da korisnik ostane prijavljen, ukloni ovu liniju:
    logout();
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-slate-100 grid place-items-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur p-8 shadow-2xl text-center">
        <div className="mb-2 text-6xl font-extrabold tracking-tight text-amber-400">404</div>
        <h2 className="text-2xl font-bold mb-2">Stranica nije pronađena</h2>
        <p className="text-slate-300 mb-8">
          Stranica koju tražite ne postoji ili je premještena.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoHome}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
          >
            Nazad na početnu
          </button>

          <button
            onClick={handleBack}
            className="px-5 py-2 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold transition"
          >
            Vrati se nazad
          </button>
        </div>
      </div>
    </main>
  );
}
