import { useState } from "react";
import { Link } from "react-router-dom";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { useAuth } from "../../hooks/auth/useAuthHook";

export function RegistracijaForma({ authApi }: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [uloga, setUloga] = useState("user");
  const [email, setEmail] = useState("");
  const [greska, setGreska] = useState("");
  const { login } = useAuth();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setGreska("Unesite email");
      return;
    }

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Neispravni podaci");
      return;
    }

    const odgovor = await authApi.registracija(korisnickoIme, lozinka, uloga, email);
    if (odgovor.success && odgovor.data) {
      login(odgovor.data);
    } else {
      setGreska(odgovor.message);
      setKorisnickoIme("");
      setLozinka("");
      setEmail("");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-slate-100 mb-6">Registracija</h1>

      <form onSubmit={podnesiFormu} className="space-y-4">
        <input
          type="text"
          placeholder="Korisničko ime"
          value={korisnickoIme}
          onChange={(e) => setKorisnickoIme(e.target.value)}
          className="w-full bg-slate-800 px-4 py-2 rounded-xl border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />

        <input
          type="password"
          placeholder="Lozinka"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          className="w-full bg-slate-800 px-4 py-2 rounded-xl border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-800 px-4 py-2 rounded-xl border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />

        <select
          value={uloga}
          onChange={(e) => setUloga(e.target.value)}
          className="w-full bg-slate-800 px-4 py-2 rounded-xl border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {greska && (
          <p className="text-md text-center text-red-500 font-medium">{greska}</p>
        )}

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-xl shadow-md transition"
        >
          Registruj se
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-slate-400">
        Već imate nalog?{" "}
        <Link to="/login" className="text-emerald-400 hover:underline">
          Prijavite se
        </Link>
      </p>
    </div>
  );
}
