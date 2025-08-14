import React, { useEffect, useMemo, useState } from "react";
import { contentApi } from "../../api_services/content/ContentAPIService";
import type { IContentAPIService } from "../../api_services/content/IContentAPIService";
import type { ContentItem, TriviaItem } from "../../types/content/Content";
import { ContentCard } from "../../components/content/ContentCard";
import { StarRating } from "../../components/content/StarRating";
import { useAuth } from "../../hooks/auth/useAuthHook";

interface Props {
  contentApi?: IContentAPIService; // možeš mockovati u testu
}

export const KatalogStranica: React.FC<Props> = ({ contentApi: svc = contentApi }) => {
  const { isAuthenticated, token } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"" | "movie" | "series">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [openId, setOpenId] = useState<number | null>(null);
  const [details, setDetails] = useState<ContentItem | null>(null);
  const [trivia, setTrivia] = useState<TriviaItem[]>([]);
  const [myRating, setMyRating] = useState<number>(7);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await svc.listContent({ q, type: type || undefined, limit: 24 });
        setItems(data);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? "Greška pri učitavanju kataloga");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [q, type, svc]);

  const showDetails = async (id: number) => {
    setOpenId(id);
    setDetails(null);
    setTrivia([]);
    try {
      const [d, t] = await Promise.all([svc.getContent(id), svc.getTrivia(id)]);
      setDetails(d);
      setTrivia(t);
    } catch {
      // graceful degrade: samo zatvori modal ako propadne
      setOpenId(null);
    }
  };

  const canRate = isAuthenticated && Boolean(token);

  const submitRating = async () => {
    if (!openId || !token) return;
    setSubmitting(true);
    try {
      await svc.rateContent(openId, myRating, token);
      // Nakon uspeha, osveži detalje da bi se prosečna ocena ažurirala
      const d = await svc.getContent(openId);
      setDetails(d);
    } catch {
      // možeš prikazati toastić ili poruku
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLabel = useMemo(
    () => (type ? (type === "movie" ? "Filmovi" : "Serije") : "Sve"),
    [type]
  );

  return (
    <main className="min-h-screen bg-gradient-to-tr from-amber-50/90 via-yellow-50/90 to-emerald-100/90">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Katalog</h1>

        {/* Filteri */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
          <input
            type="text"
            placeholder="Pretraga po naslovu…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 bg-white/70 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="bg-white/70 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Sve</option>
            <option value="movie">Filmovi</option>
            <option value="series">Serije</option>
          </select>
        </div>

        {/* Sadržaj */}
        {loading ? (
          <p className="text-gray-700">Učitavanje…</p>
        ) : error ? (
          <p className="text-red-700">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-gray-700">Nema rezultata.</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-2">
              Prikaz: <span className="font-semibold">{filteredLabel}</span> ({items.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((it) => (
                <ContentCard key={it.content_id} item={it} onOpen={showDetails} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal sa detaljima */}
      {openId !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenId(null)} />
          <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
            {details ? (
              <div className="grid md:grid-cols-2">
                <div className="aspect-[2/3] bg-gradient-to-br from-amber-100 to-emerald-100">
                  {details.cover_image ? (
                    <img src={details.cover_image} alt={details.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900">{details.title}</h2>
                  <p className="text-gray-700 mt-2">{details.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{details.type}</span>
                    {details.genre && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">{details.genre}</span>}
                    {details.release_date && <span>{new Date(details.release_date).getFullYear()}</span>}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-gray-800 font-semibold">
                      Prosečna ocena: {details.average_rating.toFixed(1)} ★
                    </span>
                    <span className="text-gray-600 text-sm">({details.rating_count})</span>
                  </div>

                  {/* Ocena (samo za prijavljene) */}
                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <StarRating value={myRating} onChange={setMyRating} disabled={!canRate} />
                      <button
                        disabled={!canRate || submitting}
                        onClick={submitRating}
                        className={`px-4 py-2 rounded-xl font-semibold transition ${
                          canRate
                            ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {submitting ? "Slanje…" : "Pošalji ocenu"}
                      </button>
                    </div>
                    {!canRate && (
                      <p className="text-xs text-gray-600 mt-1">Prijavite se da biste ocenili sadržaj.</p>
                    )}
                  </div>

                  {/* Trivia */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Trivia</h3>
                    {trivia.length === 0 ? (
                      <p className="text-gray-700 text-sm">Nema unosa.</p>
                    ) : (
                      <ul className="list-disc list-inside space-y-1 text-gray-800">
                        {trivia.map((t) => (
                          <li key={t.trivia_id}>{t.trivia_text}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800"
                      onClick={() => setOpenId(null)}
                    >
                      Zatvori
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-gray-700">Učitavanje…</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default KatalogStranica;
