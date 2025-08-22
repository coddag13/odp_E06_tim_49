import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { contentApi } from "../../api_services/content/ContentAPIService";
import type { ContentItem, ContentType } from "../../types/content/Content";
import { useAuth } from "../../hooks/auth/useAuthHook";
import ContentDetailsModal from "../../components/content/ContentDetailsModal";

type SortKey = "title" | "average_rating";
type SortDir = "asc" | "desc";

export default function PrikazPrijavljenih() {
  const { isAuthenticated, isLoading, user, token, logout } = useAuth();
  const role = user?.uloga ?? "user";
  const navigate = useNavigate();

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [type, setType] = useState<ContentType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  const [openId, setOpenId] = useState<number | null>(null);
  const openDetails = (id: number) => setOpenId(id);
  const closeDetails = () => setOpenId(null);

  const [postingId, setPostingId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const params: any = { limit: 100 };
        if (debouncedQ) params.q = debouncedQ;
        if (type !== "all") params.type = type;

        const data = await contentApi.listContent(params);
        if (cancelled) return;
        setItems(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? "Greška pri učitavanju kataloga");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (isAuthenticated) load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, debouncedQ, type, refreshKey]);

  const sortedItems = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      let A: any, B: any;
      if (sortKey === "title") {
        A = (a.title || "").toLowerCase();
        B = (b.title || "").toLowerCase();
      } else {
        A = Number(a.average_rating) || 0;
        B = Number(b.average_rating) || 0;
      }
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [items, sortKey, sortDir]);

  async function rate(contentId: number, rating: number, ev?: React.MouseEvent) {
    ev?.stopPropagation();
    try {
      const r = Math.max(1, Math.min(10, Math.round(rating)));
      if (!token) throw new Error("Niste prijavljeni.");

      if (postingId === contentId) return;
      setPostingId(contentId);

      await contentApi.rateContent(contentId, r, token);

      setUserRatings((prev) => ({ ...prev, [contentId]: r }));
      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Greška pri slanju ocene.";
      alert(msg);
      console.error("rateContent error:", e);
    } finally {
      setPostingId(null);
    }
  }

  if (isLoading) return <main className="p-6">Učitavanje…</main>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== "user" && role !== "admin") return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <header className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold">
          ODP Katalog — Dobrodošli{role === "admin" ? " (Admin)" : ""}
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pretraga po nazivu…"
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
            title="Tip"
          >
            <option value="all">Sve kategorije</option>
            <option value="movie">Film</option>
            <option value="series">Serija</option>
          </select>
          <div className="flex gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
              title="Sortiraj po"
            >
              <option value="title">Naziv</option>
              <option value="average_rating">Prosečna ocena</option>
            </select>
            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
              title="Smer"
            >
              <option value="asc">Rastuće ↑</option>
              <option value="desc">Opadajuće ↓</option>
            </select>
          </div>

          {user?.uloga === "admin" && (
            <button
              onClick={() => navigate("/admin/content/new")}
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              + Add
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition"
          >
            Odjava
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">Katalog</h2>

        {loading ? (
          <p className="text-slate-300">Učitavanje…</p>
        ) : error ? (
          <p className="text-rose-500">{error}</p>
        ) : sortedItems.length === 0 ? (
          <p className="text-slate-300">Nema sadržaja.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
            {sortedItems.map((it) => (
              <li
                key={it.content_id}
                onClick={() => openDetails(it.content_id)}
                className="cursor-pointer rounded-2xl bg-slate-800/80 backdrop-blur p-3 border border-slate-700 text-slate-100 flex flex-col hover:shadow-lg hover:-translate-y-[2px] transition"
              >
                {it.poster_url ? (
                  <img
                    src={it.poster_url}
                    alt={it.title}
                    className="w-full h-44 object-contain rounded-xl border mb-3 bg-white/10 border-slate-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-44 rounded-xl border border-slate-700 bg-slate-700 grid place-items-center text-xs text-slate-300 mb-3">
                    bez slike
                  </div>
                )}

                <div className="font-semibold line-clamp-2">{it.title}</div>
                <div className="text-xs text-slate-400 mb-2">
                  {it.type === "movie" ? "Film" : "Serija"}
                </div>

                <div className="text-sm text-slate-200 mb-2">
                  Prosečna ocena:{" "}
                  <span className="font-bold">
                    {Number.isFinite(it.average_rating as any)
                      ? Number(it.average_rating).toFixed(2)
                      : "N/A"}
                  </span>
                  {Number.isFinite(it.rating_count as any) && (
                    <span className="text-slate-400"> ({it.rating_count})</span>
                  )}
                </div>

                <RatingRow
                  current={userRatings[it.content_id] ?? 0}
                  onRate={(r, ev) => rate(it.content_id, r, ev)}
                  disabled={postingId === it.content_id}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {openId !== null && (
        <ContentDetailsModal
          id={openId}
          token={token}
          onClose={closeDetails}
          onRated={(contentId, r) => {
            setUserRatings((prev) => ({ ...prev, [contentId]: r }));
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </main>
  );
}

function RatingRow({
  current,
  onRate,
  disabled,
}: {
  current: number;
  onRate: (r: number, ev?: React.MouseEvent) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
      <div className="text-xs text-slate-400 mb-1">Daj ocenu (1–10):</div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => {
          const active = r <= current;
          return (
            <button
              key={r}
              onClick={(ev) => onRate(r, ev)}
              disabled={!!disabled}
              className={
                "px-2 py-1 rounded-lg border text-sm transition " +
                (disabled
                  ? "opacity-60 cursor-not-allowed"
                  : active
                  ? "bg-amber-500 text-slate-900 border-amber-500"
                  : "bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600")
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
        <div className="text-xs text-slate-300 mt-1">
          Vaša ocena: <span className="font-semibold">{current}</span>
        </div>
      )}
    </div>
  );
}
