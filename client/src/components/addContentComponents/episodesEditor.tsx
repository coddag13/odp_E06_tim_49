import type { EpisodeInput } from "../../types/content/AddContent";

interface EpisodesEditorProps {
  episodes: EpisodeInput[];
  onChange: (next: EpisodeInput[]) => void;
  errorText?: string;
}

export function EpisodesEditor({ episodes, onChange, errorText }: EpisodesEditorProps) {
  const addEpisode = () =>
    onChange([
      ...episodes,
      { season_number: 1, episode_number: episodes.length + 1, title: "" },
    ]);

  const updateEpisode = (i: number, patch: Partial<EpisodeInput>) =>
    onChange(episodes.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));

  const removeEpisode = (i: number) =>
    onChange(episodes.filter((_, idx) => idx !== i));

  return (
    <div className="rounded-2xl border border-slate-700 p-3 bg-slate-900">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">Epizode</h2>
        <button
          type="button"
          onClick={addEpisode}
          className="px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          + Dodaj epizodu
        </button>
      </div>

      {episodes.length === 0 && (
        <div className="text-sm text-slate-400">Još nema epizoda.</div>
      )}

      <div className="space-y-3">
        {episodes.map((ep, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-start rounded-xl p-3 border border-slate-700 bg-slate-800"
          >
            <input
              type="number"
              min={1}
              value={ep.season_number}
              onChange={(e) =>
                updateEpisode(i, { season_number: Number(e.target.value) })
              }
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Sezona"
            />
            <input
              type="number"
              min={1}
              value={ep.episode_number}
              onChange={(e) =>
                updateEpisode(i, { episode_number: Number(e.target.value) })
              }
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Epizoda"
            />
            <input
              value={ep.title}
              onChange={(e) => updateEpisode(i, { title: e.target.value })}
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Naziv epizode"
            />
            <input
              value={ep.cover_image || ""}
              onChange={(e) =>
                updateEpisode(i, { cover_image: e.target.value || undefined })
              }
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Cover URL"
            />
            <button
              type="button"
              onClick={() => removeEpisode(i)}
              className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
            >
              Ukloni
            </button>
            <textarea
              value={ep.description || ""}
              onChange={(e) =>
                updateEpisode(i, { description: e.target.value || undefined })
              }
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 sm:col-span-6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Kratak opis"
              rows={2}
            />
          </div>
        ))}
      </div>

      {errorText && <div className="text-rose-400 text-sm mt-2">{errorText}</div>}
    </div>
  );
}