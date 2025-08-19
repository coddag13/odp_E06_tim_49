/*import { useEffect, useMemo, useState } from "react";
import type React from "react"; 
import { Navigate } from "react-router-dom";
import { contentApi } from "../../api_services/content/ContentAPIService";
import type { ContentItem, ContentType } from "../../types/content/Content";
import { useAuth } from "../../hooks/auth/useAuthHook";

type SortKey = "title" | "average_rating";
type SortDir = "asc" | "desc";

export default function PrikazPrijavljenih() {
  const { isAuthenticated, isLoading, user, token } = useAuth();
  const role = user?.uloga ?? "user";

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
              onChange={(e) => setSortKey(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-amber-300 bg-white/80 text-gray-900"
              title="Sortiraj po"
            >
              <option value="title">Naziv</option>
              <option value="average_rating">Prosečna ocena</option>
            </select>
            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as any)}
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
                onClick={() => openDetails(it.content_id)}
                className="cursor-pointer rounded-xl bg-white/70 backdrop-blur p-3 border border-amber-200 text-gray-900 flex flex-col hover:shadow-md transition-shadow"
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
      <div className="text-xs text-gray-600 mb-1">Daj ocenu (1–10):</div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => {
          const active = r <= current;
          return (
            <button
              key={r}
              onClick={(ev) => onRate(r, ev)}
              disabled={!!disabled}
              className={
                "px-2 py-1 rounded-md border text-sm " +
                (disabled
                  ? "opacity-60 cursor-not-allowed"
                  : active
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


type ContentDetails = Omit<ContentItem, "description"> & {
  description?: string | null;
  overview?: string | null;
  genres?: string[] | string | null;
  release_date?: string | null; 
  seasons?: number | null;
  episodes?: number | null;
  runtime_minutes?: number | null;
  trailer_url?: string | null;
};

function ContentDetailsModal({
  id,
  token,
  onClose,
  onRated,
}: {
  id: number;
  token?: string | null;
  onClose: () => void;
  onRated?: (contentId: number, r: number) => void;
}) {
  const [data, setData] = useState<ContentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [posting, setPosting] = useState(false); 

  useEffect(() => {
    let ignore = false;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setErr(null);

        const raw = await contentApi.getContent(id);

        const normalized: ContentDetails = {
          ...raw,
          description: (raw as any).description ?? null,
          overview: (raw as any).overview ?? null,
          genres: (raw as any).genres ?? null,
          release_date: (raw as any).release_date ?? (raw as any).releaseDate ?? null,
          seasons: (raw as any).seasons ?? null,
          episodes: (raw as any).episodes ?? null,
          runtime_minutes: (raw as any).runtime_minutes ?? (raw as any).runtime ?? null,
          trailer_url: (raw as any).trailer_url ?? null,
        };

        if (!ignore) setData(normalized);
      } catch (e: any) {
        if (!ignore) setErr(e?.message ?? "Greška pri učitavanju detalja.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };

    fetchDetails();
    window.addEventListener("keydown", onKey);
    return () => {
      ignore = true;
      window.removeEventListener("keydown", onKey);
    };
  }, [id, onClose]);

  const rateHere = async (r: number) => {
    try {
      if (!token) return alert("Prijavite se da biste ocenili.");
      if (posting) return;
      setPosting(true);

      await contentApi.rateContent(id, r, token);
      onRated?.(id, r);
      alert("Hvala na oceni!");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Greška pri slanju ocene";
      alert(msg);
      console.error("rateContent (modal) error:", e);
    } finally {
      setPosting(false);
    }
  };

  const genresText =
    Array.isArray(data?.genres) ? data?.genres.join(", ") : (data?.genres ?? undefined);

  const description = data?.description ?? data?.overview ?? undefined;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-bold text-lg">Detalji</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border bg-white hover:bg-gray-50"
          >
            Zatvori
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div>Učitavanje…</div>
          ) : err ? (
            <div className="text-red-600">{err}</div>
          ) : !data ? (
            <div>Nema podataka.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-[160px,1fr] gap-4">
              <div>
                {data.poster_url ? (
                  <img
                    src={data.poster_url}
                    alt={data.title}
                    className="w-full h-56 object-contain rounded-lg border bg-white"
                  />
                ) : (
                  <div className="w-full h-56 rounded-lg border bg-gray-100 grid place-items-center text-xs text-gray-500">
                    bez slike
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-extrabold">{data.title}</h4>
                <div className="text-sm text-gray-700">
                  Tip: <b>{data.type === "movie" ? "Film" : "Serija"}</b>
                </div>
                {data.release_date && (
                  <div className="text-sm text-gray-700">
                    Datum izlaska: {new Date(data.release_date).toLocaleDateString()}
                  </div>
                )}
                {genresText && (
                  <div className="text-sm text-gray-700">Žanrovi: {genresText}</div>
                )}
                {data.runtime_minutes && (
                  <div className="text-sm text-gray-700">
                    Trajanje: {data.runtime_minutes} min
                  </div>
                )}
                {typeof data.average_rating !== "undefined" && (
                  <div className="text-sm text-gray-800">
                    Prosečna ocena:{" "}
                    <b>
                      {Number.isFinite(data.average_rating as any)
                        ? Number(data.average_rating).toFixed(2)
                        : "N/A"}
                    </b>
                  </div>
                )}
                {description && (
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">{description}</p>
                )}

              
                <div className="pt-2">
                  <div className="text-xs text-gray-600 mb-1">Daj ocenu (1–10):</div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => (
                      <button
                        key={r}
                        onClick={() => rateHere(r)}
                        disabled={posting}
                        className={
                          "px-2 py-1 rounded-md border text-sm " +
                          (posting
                            ? "opacity-60 cursor-not-allowed bg-white border-amber-300 text-gray-800"
                            : "bg-white hover:bg-amber-50 border-amber-300 text-gray-800")
                        }
                        title={`Oceni ${r}`}
                        type="button"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {data.trailer_url && (
                  <div className="pt-3">
                    <a
                      href={data.trailer_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-700 underline"
                    >
                      Pogledaj trejler
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}*/
import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { contentApi } from "../../api_services/content/ContentAPIService";
import type { ContentItem, ContentType } from "../../types/content/Content";
import { useAuth } from "../../hooks/auth/useAuthHook";

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
              onChange={(e) => setSortKey(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-amber-300 bg-white/80 text-gray-900"
              title="Sortiraj po"
            >
              <option value="title">Naziv</option>
              <option value="average_rating">Prosečna ocena</option>
            </select>
            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-amber-300 bg-white/80 text-gray-900"
              title="Smer"
            >
              <option value="asc">Rastuće ↑</option>
              <option value="desc">Opadajuće ↓</option>
            </select>
          </div>
          {user?.uloga === "admin" && (
            <button
              onClick={() => navigate("/admin/content/new")}
              className="px-3 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
            >
              + Add
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
          >
            Odjava
          </button>
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
                onClick={() => openDetails(it.content_id)}
                className="cursor-pointer rounded-xl bg-white/70 backdrop-blur p-3 border border-amber-200 text-gray-900 flex flex-col hover:shadow-md transition-shadow"
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
      <div className="text-xs text-gray-600 mb-1">Daj ocenu (1–10):</div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => {
          const active = r <= current;
          return (
            <button
              key={r}
              onClick={(ev) => onRate(r, ev)}
              disabled={!!disabled}
              className={
                "px-2 py-1 rounded-md border text-sm " +
                (disabled
                  ? "opacity-60 cursor-not-allowed"
                  : active
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

type ContentDetails = Omit<ContentItem, "description"> & {
  description?: string | null;
  overview?: string | null;
  genres?: string[] | string | null;
  release_date?: string | null;
  seasons?: number | null;
  episodes?: number | null;
  runtime_minutes?: number | null;
  trailer_url?: string | null;
};

function ContentDetailsModal({
  id,
  token,
  onClose,
  onRated,
}: {
  id: number;
  token?: string | null;
  onClose: () => void;
  onRated?: (contentId: number, r: number) => void;
}) {
  const [data, setData] = useState<ContentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  // ✨ DODATO: stanje za trivia i epizode
  const [triviaList, setTriviaList] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    let ignore = false;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setErr(null);

        const raw = await contentApi.getContent(id);

        const normalized: ContentDetails = {
          ...raw,
          description: (raw as any).description ?? null,
          overview: (raw as any).overview ?? null,
          genres: (raw as any).genres ?? null,
          release_date: (raw as any).release_date ?? (raw as any).releaseDate ?? null,
          seasons: (raw as any).seasons ?? null,
          episodes: (raw as any).episodes ?? null,
          runtime_minutes: (raw as any).runtime_minutes ?? (raw as any).runtime ?? null,
          trailer_url: (raw as any).trailer_url ?? null,
        };

        if (!ignore) setData(normalized);
      } catch (e: any) {
        if (!ignore) setErr(e?.message ?? "Greška pri učitavanju detalja.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    // ✨ DODATO: trivia + epizode
    const fetchSideData = async () => {
      try {
        const [trivia, eps] = await Promise.all([
          contentApi.getTrivia(id),
          contentApi.getEpisodes?.(id) ?? Promise.resolve([]), // ako metoda ne postoji, vrati prazno
        ]);
        if (!ignore) {
          setTriviaList(Array.isArray(trivia) ? trivia : []);
          setEpisodes(Array.isArray(eps) ? eps : []);
        }
      } catch (e) {
        // nije kritično
        console.warn("Side data error:", e);
      }
    };

    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };

    fetchDetails();
    fetchSideData(); // ✨
    window.addEventListener("keydown", onKey);
    return () => {
      ignore = true;
      window.removeEventListener("keydown", onKey);
    };
  }, [id, onClose]);

  const rateHere = async (r: number) => {
    try {
      if (!token) return alert("Prijavite se da biste ocenili.");
      if (posting) return;
      setPosting(true);

      await contentApi.rateContent(id, r, token);
      onRated?.(id, r);
      alert("Hvala na oceni!");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Greška pri slanju ocene";
      alert(msg);
      console.error("rateContent (modal) error:", e);
    } finally {
      setPosting(false);
    }
  };

  const genresText =
    Array.isArray(data?.genres) ? data?.genres.join(", ") : (data?.genres ?? undefined);

  const description = data?.description ?? data?.overview ?? undefined;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-bold text-lg">Detalji</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border bg-white hover:bg-gray-50"
          >
            Zatvori
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div>Učitavanje…</div>
          ) : err ? (
            <div className="text-red-600">{err}</div>
          ) : !data ? (
            <div>Nema podataka.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-[160px,1fr] gap-4">
              <div>
                {data.poster_url ? (
                  <img
                    src={data.poster_url}
                    alt={data.title}
                    className="w-full h-56 object-contain rounded-lg border bg-white"
                  />
                ) : (
                  <div className="w-full h-56 rounded-lg border bg-gray-100 grid place-items-center text-xs text-gray-500">
                    bez slike
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-extrabold">{data.title}</h4>
                <div className="text-sm text-gray-700">
                  Tip: <b>{data.type === "movie" ? "Film" : "Serija"}</b>
                </div>
                {data.release_date && (
                  <div className="text-sm text-gray-700">
                    Datum izlaska: {new Date(data.release_date).toLocaleDateString()}
                  </div>
                )}
                {genresText && (
                  <div className="text-sm text-gray-700">Žanrovi: {genresText}</div>
                )}
                {data.runtime_minutes && (
                  <div className="text-sm text-gray-700">
                    Trajanje: {data.runtime_minutes} min
                  </div>
                )}
                {typeof data.average_rating !== "undefined" && (
                  <div className="text-sm text-gray-800">
                    Prosečna ocena:{" "}
                    <b>
                      {Number.isFinite(data.average_rating as any)
                        ? Number(data.average_rating).toFixed(2)
                        : "N/A"}
                    </b>
                  </div>
                )}
                {description && (
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">{description}</p>
                )}

                <div className="pt-2">
                  <div className="text-sm text-gray-700 mb-1">Daj ocenu:</div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => (
                      <button
                        key={r}
                        onClick={() => rateHere(r)}
                        disabled={posting}
                        className={
                          "px-2 py-1 rounded-md border text-sm " +
                          (posting
                            ? "opacity-60 cursor-not-allowed"
                            : "bg-white/80 border-amber-300 text-gray-800 hover:bg-amber-50")
                        }
                        title={`Oceni ${r}`}
                        type="button"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ✨ TRIVIA */}
                {triviaList.length > 0 && (
                  <div className="pt-3">
                    <h5 className="font-semibold mb-1">Trivia</h5>
                    <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                      {triviaList.map((t: any) => (
                        <li key={t.trivia_id}>{t.trivia_text}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ✨ EPIZODE */}
                {episodes.length > 0 && (
                  <div className="pt-4">
                    <h5 className="font-semibold mb-2">Epizode</h5>
                    <div className="max-h-64 overflow-auto border rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-2">Sezona</th>
                            <th className="text-left p-2">Ep.</th>
                            <th className="text-left p-2">Naziv</th>
                            <th className="text-left p-2">Opis</th>
                          </tr>
                        </thead>
                        <tbody>
                          {episodes.map((ep: any) => (
                            <tr key={ep.episode_id} className="border-t">
                              <td className="p-2">{ep.season_number}</td>
                              <td className="p-2">{ep.episode_number}</td>
                              <td className="p-2 font-medium">{ep.title}</td>
                              <td className="p-2 text-gray-700">{ep.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {data.trailer_url && (
                  <div className="pt-2">
                    <a
                      href={data.trailer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Pogledaj trejler
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}