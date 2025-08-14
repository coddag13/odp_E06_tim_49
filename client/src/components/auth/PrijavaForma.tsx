import { useState } from "react";
import { Link } from "react-router-dom";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { useAuth } from "../../hooks/auth/useAuthHook";

export function PrijavaForma({ authApi }: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const { login } = useAuth();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Неисправни подаци");
      return;
    }

    const odgovor = await authApi.prijava(korisnickoIme, lozinka);
    if (odgovor.success && odgovor.data) {
      login(odgovor.data);
    } else {
      setGreska(odgovor.message);
      setKorisnickoIme("");
      setLozinka("");
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-lg shadow-xl rounded-2xl p-10 w-full max-w-md border border-amber-300">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Пријава</h1>

      <form onSubmit={podnesiFormu} className="space-y-4">
        <input
          type="text"
          placeholder="Корисничко име"
          value={korisnickoIme}
          onChange={(e) => setKorisnickoIme(e.target.value)}
          className="w-full bg-white/60 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 transition"
        />

        <input
          type="password"
          placeholder="Лозинка"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          className="w-full bg-white/60 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 transition"
        />

        {greska && (
          <p className="text-md text-center text-red-700/80 font-medium">{greska}</p>
        )}

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-2 rounded-xl shadow-sm hover:shadow-md transition"
        >
          Пријави се
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Немате налог?{" "}
        <Link to="/register" className="text-amber-700 hover:underline">
          Региструјте се
        </Link>
      </p>
    </div>
  );
}
