import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { contentApi } from "../../api_services/content/ContentAPIService";
import type { AddContentPayload, EpisodeInput, ContentType } from "../../types/content/AddContent";

export default function AddContentPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState<ContentType>("movie");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [release_date, setReleaseDate] = useState(""); // 'YYYY-MM-DD'
  const [cover_image, setCoverImage] = useState("");
  const [genre, setGenre] = useState("");
  const [trivia, setTrivia] = useState("");

  const [episodes, setEpisodes] = useState<EpisodeInput[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const addEpisode = () =>
    setEpisodes(prev => [
      ...prev,
      { season_number: 1, episode_number: prev.length + 1, title: "" },
    ]);

  const updateEpisode = (i: number, patch: Partial<EpisodeInput>) =>
    setEpisodes(prev => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));

  const removeEpisode = (i: number) =>
    setEpisodes(prev => prev.filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!token) { setErr("Niste prijavljeni."); return; }
    if (user?.uloga !== "admin") { setErr("Samo admin može dodavati sadržaj."); return; }
    if (!title.trim()) { setErr("Naslov je obavezan."); return; }

    const payload: AddContentPayload = {
      type,
      title: title.trim(),
      description: description || null,
      release_date: release_date || null,
      cover_image: cover_image || null,
      genre: genre || null,
      trivia: trivia || null,
      episodes: type === "series" ? episodes : undefined,
    };

    try {
      setBusy(true);
      await contentApi.createContent(payload, token);
      alert("Sadržaj je dodat.");
      navigate(-1); // prilagodi ako ti je drugačija ruta
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        e?.message || "Greška pri dodavanju.";
      setErr(msg);
      console.error("createContent error:", e);
    } finally {
      setBusy(false);
    }
  };

  if (user?.uloga !== "admin") {
    return <main className="p-6">Dozvoljeno samo adminu.</main>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-amber-50/90 via-yellow-50/90 to-emerald-100/90">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold text-gray-900">Dodaj sadržaj</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            Nazad
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3 bg-white/70 backdrop-blur p-4 rounded-xl border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="px-3 py-2 rounded-lg border"
            >
              <option value="movie">Film</option>
              <option value="series">Serija</option>
            </select>

            <input
              placeholder="Naslov"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 rounded-lg border"
            />
          </div>

          <textarea
            placeholder="Opis radnje"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 rounded-lg border w-full"
            rows={4}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              placeholder="Datum izlaska (YYYY-MM-DD)"
              value={release_date}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="px-3 py-2 rounded-lg border"
            />
            <input
              placeholder="Cover URL"
              value={cover_image}
              onChange={(e) => setCoverImage(e.target.value)}
              className="px-3 py-2 rounded-lg border"
            />
            <input
              placeholder="Žanr (npr: Drama, Sci-Fi)"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="px-3 py-2 rounded-lg border"
            />
          </div>

          <textarea
            placeholder="Trivia (opciono)"
            value={trivia}
            onChange={(e) => setTrivia(e.target.value)}
            className="px-3 py-2 rounded-lg border w-full"
            rows={3}
          />

          {type === "series" && (
            <div className="rounded-xl border p-3 bg-white/60">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Epizode</h2>
                <button
                  type="button"
                  onClick={addEpisode}
                  className="px-3 py-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  + Dodaj epizodu
                </button>
              </div>

              {episodes.length === 0 && (
                <div className="text-sm text-gray-600">Još nema epizoda.</div>
              )}

              <div className="space-y-2">
                {episodes.map((ep, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-start">
                    <input
                      type="number"
                      min={1}
                      value={ep.season_number}
                      onChange={(e) => updateEpisode(i, { season_number: Number(e.target.value) })}
                      className="px-3 py-2 rounded-lg border"
                      placeholder="Sezona"
                    />
                    <input
                      type="number"
                      min={1}
                      value={ep.episode_number}
                      onChange={(e) => updateEpisode(i, { episode_number: Number(e.target.value) })}
                      className="px-3 py-2 rounded-lg border"
                      placeholder="Epizoda"
                    />
                    <input
                      value={ep.title}
                      onChange={(e) => updateEpisode(i, { title: e.target.value })}
                      className="px-3 py-2 rounded-lg border sm:col-span-2"
                      placeholder="Naziv epizode"
                    />
                    <input
                      value={ep.cover_image || ""}
                      onChange={(e) => updateEpisode(i, { cover_image: e.target.value || undefined })}
                      className="px-3 py-2 rounded-lg border"
                      placeholder="Cover URL"
                    />
                    <button
                      type="button"
                      onClick={() => removeEpisode(i)}
                      className="px-3 py-2 rounded-lg bg-red-500 text-white"
                    >
                      Ukloni
                    </button>
                    <textarea
                      value={ep.description || ""}
                      onChange={(e) => updateEpisode(i, { description: e.target.value || undefined })}
                      className="px-3 py-2 rounded-lg border sm:col-span-6"
                      placeholder="Kratak opis"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {err && <div className="text-red-700">{err}</div>}

          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold disabled:opacity-60"
          >
            {busy ? "Čuvanje…" : "Sačuvaj"}
          </button>
        </form>
      </div>
    </main>
  );
}