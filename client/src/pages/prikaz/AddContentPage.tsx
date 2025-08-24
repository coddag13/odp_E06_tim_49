import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { contentApi } from "../../api_services/content/ContentAPIService";
import {
  validateContentForm,
  type FieldErrors,
} from "../../helpers/content_validation"; 
import type {
  AddContentPayload,
  EpisodeInput,
  ContentType,
} from "../../types/content/AddContent";

export default function AddContentPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState<ContentType>("movie");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [release_date, setReleaseDate] = useState(""); 
  const [cover_image, setCoverImage] = useState("");
  const [genre, setGenre] = useState("");
  const [trivia, setTrivia] = useState("");

  const [episodes, setEpisodes] = useState<EpisodeInput[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const addEpisode = () =>
    setEpisodes((prev) => [
      ...prev,
      { season_number: 1, episode_number: prev.length + 1, title: "" },
    ]);

  const updateEpisode = (i: number, patch: Partial<EpisodeInput>) =>
    setEpisodes((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));

  const removeEpisode = (i: number) =>
    setEpisodes((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setErrors({});

    if (!token) return setErr("Niste prijavljeni.");
    if (user?.uloga !== "admin") return setErr("Samo admin može dodavati sadržaj.");

    const next = validateContentForm({
      type,
      title,
      release_date,
      cover_image,
      genre,
      trivia,
      episodes,
    });

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const payload: AddContentPayload = {
      type,
      title: title.trim(),
      description: description?.trim() || null,
      release_date: release_date?.trim() || null,
      cover_image: cover_image?.trim() || null,
      genre: genre?.trim() || null,
      trivia: trivia?.trim() || null,
      episodes: type === "series" ? episodes : undefined,
    };

    try {
      setBusy(true);
      await contentApi.createContent(payload, token);
      alert("Sadržaj je dodat.");
      navigate(-1);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        e?.message ||
        "Greška pri dodavanju.";
      setErr(msg);
      console.error("createContent error:", e);
    } finally {
      setBusy(false);
    }
  };

  if (user?.uloga !== "admin") {
    return (
      <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">
        Dozvoljeno samo adminu.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold">Dodaj sadržaj</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
          >
            Nazad
          </button>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-700 p-5 shadow-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="movie">Film</option>
              <option value="series">Serija</option>
            </select>

            <div>
              <input
                placeholder="Naslov"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.title && (
                <div className="text-rose-400 text-sm mt-1">{errors.title}</div>
              )}
            </div>
          </div>

          <div>
            <textarea
              placeholder="Opis radnje"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Datum izlaska (YYYY-MM-DD)"
                value={release_date}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.release_date && (
                <div className="text-rose-400 text-sm mt-1">{errors.release_date}</div>
              )}
            </div>

            <div>
              <input
                type="url"
                placeholder="Cover URL"
                value={cover_image}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.cover_image && (
                <div className="text-rose-400 text-sm mt-1">{errors.cover_image}</div>
              )}
            </div>

            <div>
              <input
                placeholder="Žanr (npr: Drama, Sci-Fi)"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.genre && (
                <div className="text-rose-400 text-sm mt-1">{errors.genre}</div>
              )}
            </div>
          </div>

          <div>
            <textarea
              placeholder="Trivia (opciono)"
              value={trivia}
              onChange={(e) => setTrivia(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
            />
            {errors.trivia && (
              <div className="text-rose-400 text-sm mt-1">{errors.trivia}</div>
            )}
          </div>

          {type === "series" && (
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

              {errors.episodes && (
                <div className="text-rose-400 text-sm mt-2">{errors.episodes}</div>
              )}
            </div>
          )}

          {err && <div className="text-rose-400">{err}</div>}

          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-60 transition"
          >
            {busy ? "Čuvanje…" : "Sačuvaj"}
          </button>
        </form>
      </div>
    </main>
  );
}
