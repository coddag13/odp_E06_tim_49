import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { contentApi } from "../../api_services/content/ContentAPIService";
import type { ContentItem, ContentType } from "../../types/content/Content";
import { useAuth } from "../../hooks/auth/useAuthHook";
import ContentDetailsModal from "../../components/content/ContentDetailsModal";

import { KatalogHeader } from "../../components/katalogComponents/katalogHeaderForm";
import { KatalogFilters } from "../../components/katalogComponents/katalogFiltersForm";
import { KatalogGrid } from "../../components/katalogComponents/katalogGridForm";

type SortKey = "title" | "average_rating";
type SortDir = "asc" | "desc";

export default function KatalogPage() {
  const { isAuthenticated, user, token, logout } = useAuth();
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
  const [postingId, setPostingId] = useState<number | null>(null);

  const openDetails = (id: number) => setOpenId(id);
  const closeDetails = () => setOpenId(null);

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
        if (isAuthenticated) {
          if (debouncedQ) params.q = debouncedQ;
          if (type !== "all") params.type = type;
        }
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

    load();
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const listData = isAuthenticated ? sortedItems : items;

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_800px_at_10%_-10%,#0b1220_0%,#0a0f1a_30%,#090f18_60%,#070c13_100%)] text-gray-100">
      <KatalogHeader
        isAuthenticated={isAuthenticated}
        role={role}
        onLogout={handleLogout}
        onGoAdd={() => navigate("/admin/content/new")}
        leftActionsWhenGuest={
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-900 font-semibold shadow hover:bg-amber-400 active:scale-[.98] transition"
            >
              Prijavi se
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
            >
              Registruj se
            </Link>
          </>
        }
      />

      {isAuthenticated && (
        <KatalogFilters
          q={q}
          setQ={setQ}
          type={type}
          setType={setType}
          sortKey={sortKey}
          setSortKey={setSortKey}
          sortDir={sortDir}
          setSortDir={setSortDir}
          showAddButton={user?.uloga === "admin"}
          onAdd={() => navigate("/admin/content/new")}
        />
      )}

      <section className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">Katalog</h2>

        {loading ? (
          <p className="text-slate-300">Učitavanje…</p>
        ) : error ? (
          <p className="text-rose-500">{error}</p>
        ) : listData.length === 0 ? (
          <p className="text-slate-300">Nema sadržaja.</p>
        ) : (
          <KatalogGrid
            items={listData}
            isAuthenticated={isAuthenticated}
            postingId={postingId}
            currentRatings={userRatings}
            onRate={rate}
            onOpenDetails={openDetails}
          />
        )}
      </section>

      <AnimatePresence initial={false} mode="wait">
        {openId !== null && (
          <ContentDetailsModal
            key={openId}
            id={openId}
            token={token}
            onClose={closeDetails}
            onRated={(contentId, r) => {
              setUserRatings((prev) => ({ ...prev, [contentId]: r }));
              setRefreshKey((k) => k + 1);
            }}
            currentUserRating={userRatings[openId] ?? 0}
          />
        )}
      </AnimatePresence>
    </main>
  );
}