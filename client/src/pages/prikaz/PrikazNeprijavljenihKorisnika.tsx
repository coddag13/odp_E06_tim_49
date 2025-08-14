import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "../../api_services/content/ContentAPIService";
import type { ContentItem } from "../../types/content/Content";

export default function PrikazNeprijavljenih() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await contentApi.listContent({ limit: 100 }); // prikaži do 100 naslova
        setItems(data);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? "Greška pri učitavanju kataloga");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-amber-50/90 via-yellow-50/90 to-emerald-100/90">
      {/* Gornja traka */}
      <header className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">ODP Katalog</h1>
        <Link
          to="/login"
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold transition"
        >
          Пријави се
        </Link>
      </header>

      {/* Lista naslova */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Filmovi i serije</h2>

        {loading ? (
          <p className="text-gray-700">Učitavanje…</p>
        ) : error ? (
          <p className="text-red-700">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-gray-700">Nema sadržaja.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {items.map((it) => (
              <li
                key={it.content_id}
                className="rounded-lg bg-white/70 backdrop-blur px-4 py-2 border border-amber-200 text-gray-900"
              >
                {it.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
