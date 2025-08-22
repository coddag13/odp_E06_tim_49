import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "../../api_services/content/ContentAPIService";
import type { ContentItem } from "../../types/content/Content";

export default function PrikazNeprijavljenihKorisnika() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await contentApi.listContent({ limit: 100 });
        setItems(Array.isArray(data) ? data : []);
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
    <main className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">
          ODP Katalog
        </h1>

        <Link
          to="/login"
          className="px-4 py-2 rounded-xl bg-amber-500 text-slate-900 font-semibold shadow hover:bg-amber-400 active:scale-[.98] transition"
        >
          Пријави се
        </Link>
      </header>

      {/* Lista */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">
          Filmovi i serije
        </h2>

        {loading ? (
          <p className="text-slate-300">Učitavanje…</p>
        ) : error ? (
          <p className="text-rose-400 break-words">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-slate-300">Nema sadržaja.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {items.map((it) => (
              <li
                key={it.content_id}
                className="rounded-2xl bg-slate-800/80 backdrop-blur px-3 py-2 border border-slate-700 text-slate-100 flex gap-3 items-center hover:-translate-y-[2px] hover:shadow-lg transition"
              >
                {it.poster_url ? (
                  <img
                    src={it.poster_url}
                    alt={it.title}
                    className="w-14 h-14 object-contain rounded-md border border-slate-700 bg-slate-900"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-md border border-slate-700 bg-slate-700 grid place-items-center text-[10px] text-slate-300">
                    bez slike
                  </div>
                )}

                <div className="min-w-0">
                  <div className="font-semibold truncate">{it.title}</div>
                  {it.type && (
                    <div className="text-xs text-slate-400">
                      {it.type === "movie" ? "Film" : "Serija"}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
