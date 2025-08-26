import { useEffect, useState } from "react";
import { ModalShell } from "./modalShell";
import { RatingBar } from "./ratingBar";
import { TriviaList } from "./triviaList";
import { EpisodesTable } from "./episodesTable";

import { contentApi } from "../../api_services/content/ContentAPIService";
import type { ContentItem } from "../../types/content/Content";
import { triviaApi } from "../../api_services/content/TriviaAPIService";
import { episodeApi } from "../../api_services/content/EpisodeAPIService";

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
  currentUserRating = 0,
}: {
  id: number;
  token?: string | null;
  onClose: () => void;
  onRated?: (contentId: number, r: number) => void;
  currentUserRating?: number;
}) {
  const [data, setData] = useState<ContentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const [triviaList, setTriviaList] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [myRating, setMyRating] = useState<number>(currentUserRating);
  useEffect(() => setMyRating(currentUserRating), [currentUserRating]);

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
          triviaApi.getTrivia(id),
          episodeApi.getEpisodes(id),
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
      setMyRating(r);
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
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h3 className="font-bold text-lg">Detalji</h3>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-md border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
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
              <div className="text-sm">
                Tip: <b>{data.type === "movie" ? "Film" : "Serija"}</b>
              </div>
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

              
              <div className="pt-2">
                <RatingBar current={myRating} onRate={rateHere} disabled={posting} />
              </div>

              <TriviaList items={triviaList} />

              <EpisodesTable
                items={episodes}
                fallbackImage={data.poster_url ?? (data as any)?.cover_image ?? null}
                title="Epizode"
              />

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
    </ModalShell>
  );
}