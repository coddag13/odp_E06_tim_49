import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { contentApi } from "../../api_services/content/ContentAPIService";
import type { ContentItem, ContentType } from "../../types/content/Content";

function useAuthLike() {
  const token = localStorage.getItem("token") ?? "";
  const role = localStorage.getItem("role") ?? "user"; 
  return { token, role, isLoggedIn: Boolean(token) };
}

type SortKey = "title" | "average_rating";
type SortDir = "asc" | "desc";

export default function PrikazPrijavljenih() {
  const { token, role, isLoggedIn } = useAuthLike();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [q, setQ] = useState("");
  const [type, setType] = useState<ContentType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [userRatings, setUserRatings] = useState<Record<number, number>>({}); 

  
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== "user" && role !== "admin") return <Navigate to="/login" replace />;

  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 500);
    return () => clearTimeout(t);
  }, [q]);

  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const params: any = { limit: 100 };
        if (debouncedQ) params.q = debouncedQ;
        if (type !== "all") params.type = type;

        const data = await contentApi.listContent(params);
        setItems(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? "Greška pri učitavanju kataloga");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedQ, type]);


  const sortedItems = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      let A: any, B: any;
      if (sortKey === "title") {
        A = (a.title || "").toLowerCase();
        B = (b.title || "").toLowerCase();
      } else {
        
        A = Number.isFinite(a.average_rating as any) ? Number(a.average_rating) : 0;
        B = Number.isFinite(b.average_rating as any) ? Number(b.average_rating) : 0;
      }
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [items, sortKey, sortDir]);

  async function rate(contentId: number, rating: number) {
    try {
      
      const r = Math.max(1, Math.min(10, Math.round(rating)));
      if (!token) throw new Error("Niste prijavljeni.");
      await contentApi.rateContent(contentId, r, token);

      
      setUserRatings((prev) => ({ ...prev, [contentId]: r }));

      alert("Hvala na oceni!");
    } catch (e: any) {
      if (String(e?.message || "").includes("401")) {
        alert("Sesija je istekla. Prijavite se ponovo.");
      } else {
        alert(e?.message ?? "Greška pri slanju ocene");
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-amber-50/90 via-yellow-50/90 to-emerald-100/90">
      
      <header className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          ODP Katalog — Dobrodošli{role === "admin" ? " (Admin)" : ""}
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pretraga po nazivu…"
            className="px-3 py-2 rounded-lg border border-amber-300 bg-white/80 backdrop-blur text-gray-900"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-amber-300 bg-white/80 text-gray-900"
            title="Tip"
          >
            <option value="all">Sve kategorije</option>
            <option value="movie">Film</option>
            <option value="series">Serija</option>
          </select>
          <div className="flex gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="px-3 py-2 rounded-lg border border-amber-300 bg-white/80 text-gray-900"
              title="Sortiraj po"
            >
              <option value="title">Naziv</option>
              <option value="average_rating">Prosečna ocena</option>
            </select>
            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as SortDir)}
              className="px-3 py-2 rounded-lg border border-amber-300 bg-white/80 text-gray-900"
              title="Smer"
            >
              <option value="asc">Rastuće ↑</option>
              <option value="desc">Opadajuće ↓</option>
            </select>
          </div>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Katalog</h2>

        {loading ? (
          <p className="text-gray-700">Učitavanje…</p>
        ) : error ? (
          <p className="text-red-700">{error}</p>
        ) : sortedItems.length === 0 ? (
          <p className="text-gray-700">Nema sadržaja.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedItems.map((it) => (
              <li
                key={it.content_id}
                className="rounded-xl bg-white/70 backdrop-blur p-3 border border-amber-200 text-gray-900 flex flex-col"
              >
                {it.poster_url ? (
                  <img
                    src={it.poster_url}
                    alt={it.title}
                    className="w-full h-40 object-contain rounded-lg border mb-2 bg-white"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-40 rounded-lg border bg-gray-100 grid place-items-center text-xs text-gray-500 mb-2">
                    bez slike
                  </div>
                )}

                <div className="font-semibold line-clamp-2">{it.title}</div>
                <div className="text-xs text-gray-600 mb-2">
                  {it.type === "movie" ? "Film" : "Serija"}
                </div>

            
                <div className="text-sm text-gray-800 mb-1">
                  Prosečna ocena:{" "}
                  <span className="font-semibold">
                    {Number.isFinite(it.average_rating as any)
                      ? Number(it.average_rating).toFixed(2)
                      : "N/A"}
                  </span>
                  {Number.isFinite(it.rating_count as any) && (
                    <span className="text-gray-500"> ({it.rating_count})</span>
                  )}
                </div>

                
                <RatingRow
                  current={userRatings[it.content_id] ?? 0}
                  onRate={(r) => rate(it.content_id, r)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}


function RatingRow({ current, onRate }: { current: number; onRate: (r: number) => void }) {
  return (
    <div className="mt-auto pt-2">
      <div className="text-xs text-gray-600 mb-1">Daj ocenu (1–10):</div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => {
          const active = r <= current;
          return (
            <button
              key={r}
              onClick={() => onRate(r)}
              className={
                "px-2 py-1 rounded-md border text-sm " +
                (active
                  ? "bg-amber-500/90 border-amber-600 text-slate-900"
                  : "bg-white/80 border-amber-300 text-gray-800 hover:bg-amber-50")
              }
              title={`Oceni ${r}`}
              type="button"
            >
              {r}
            </button>
          );
        })}
      </div>
      {current > 0 && (
        <div className="text-xs text-gray-700 mt-1">
          Vaša ocena: <span className="font-semibold">{current}</span>
        </div>
      )}
    </div>
  );
}
