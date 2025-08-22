import { useEffect, useState } from "react";
import { contentApi } from "../../api_services/content/ContentAPIService";
import type { ContentItem } from "../../types/content/Content";

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

export default function ContentDetailsModal({
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

    const fetchSideData = async () => {
      try {
        const [trivia, eps] = await Promise.all([
          contentApi.getTrivia(id),
          contentApi.getEpisodes(id),
        ]);
        if (!ignore) {
          setTriviaList(Array.isArray(trivia) ? trivia : []);
          setEpisodes(Array.isArray(eps) ? eps : []);
        }
      } catch (e) {
        console.warn("Side data error:", e);
      }
    };

    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };

    fetchDetails();
    fetchSideData();
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
        className="w-full max-w-3xl max-h-[90vh] bg-slate-900 rounded-2xl shadow-2xl overflow-y-auto text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h3 className="font-bold text-lg">Detalji</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
          >
            Zatvori
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div>Učitavanje…</div>
          ) : err ? (
            <div className="text-rose-500">{err}</div>
          ) : !data ? (
            <div>Nema podataka.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-[200px,1fr] gap-4">
              <div>
                {data.poster_url ? (
                  <img
                    src={data.poster_url}
                    alt={data.title}
                    className="w-full h-56 object-contain rounded-lg border border-slate-700 bg-slate-800"
                  />
                ) : (
                  <div className="w-full h-56 rounded-lg border border-slate-700 bg-slate-800 grid place-items-center text-xs text-slate-400">
                    bez slike
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-extrabold">{data.title}</h4>
                <div className="text-sm">Tip: <b>{data.type === "movie" ? "Film" : "Serija"}</b></div>
                {data.release_date && (
                  <div className="text-sm">
                    Datum izlaska: {new Date(data.release_date).toLocaleDateString()}
                  </div>
                )}
                {genresText && <div className="text-sm">Žanrovi: {genresText}</div>}

                {typeof data.average_rating !== "undefined" && (
                  <div className="text-sm">
                    Prosečna ocena:{" "}
                    <b>
                      {Number.isFinite(data.average_rating as any)
                        ? Number(data.average_rating).toFixed(2)
                        : "N/A"}
                    </b>
                  </div>
                )}
                {description && <p className="text-sm whitespace-pre-wrap">{description}</p>}

                {/* Ocjenjivanje */}
                <div className="pt-2">
                  <div className="text-sm mb-1">Daj ocenu:</div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => (
                      <button
                        key={r}
                        onClick={() => rateHere(r)}
                        disabled={posting}
                        className={
                          "px-2 py-1 rounded-md border text-sm transition " +
                          (posting
                            ? "opacity-60 cursor-not-allowed bg-slate-800 border-slate-700"
                            : "bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700")
                        }
                        title={`Oceni ${r}`}
                        type="button"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trivia */}
                {triviaList.length > 0 && (
                  <div className="pt-3">
                    <h5 className="font-semibold mb-1">Trivia</h5>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {triviaList.map((t: any) => (
                        <li key={t.trivia_id}>{t.trivia_text}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Epizode */}
                {episodes.length > 0 && (
                  <div className="pt-4">
                    <h5 className="font-semibold mb-2">Epizode</h5>
                    <div className="max-h-64 overflow-auto border rounded-lg border-slate-700">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-800/80">
                          <tr>
                            <th className="text-left p-2">Sezona</th>
                            <th className="text-left p-2">Ep.</th>
                            <th className="text-left p-2">Naziv</th>
                            <th className="text-left p-2">Opis</th>
                          </tr>
                        </thead>
                        <tbody>
                          {episodes.map((ep: any) => (
                            <tr key={ep.episode_id} className="border-t border-slate-700">
                              <td className="p-2">{ep.season_number}</td>
                              <td className="p-2">{ep.episode_number}</td>
                              <td className="p-2 font-medium">{ep.title}</td>
                              <td className="p-2 text-slate-300">{ep.description || "-"}</td>
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
                      className="text-blue-400 hover:underline"
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