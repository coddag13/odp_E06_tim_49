import { useState } from "react";
import type { IContentAPIService } from "../../api_services/content/IContentAPIService";
import {
  validateContentForm,
  type FieldErrors,
} from "../../helpers/content_validation";
import type {
  AddContentPayload,
  EpisodeInput,
  ContentType,
} from "../../types/content/AddContent";
import { EpisodesEditor } from "./episodesEditor";

interface AddContentFormProps {
  contentApi: IContentAPIService;   // servis ubrizgan izvana
  token: string | null;
  isAdmin: boolean;
  onSuccess?: () => void;
}

export function AddContentForm({
  contentApi,
  token,
  isAdmin,
  onSuccess,
}: AddContentFormProps) {
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setErrors({});

    if (!token) return setErr("Niste prijavljeni.");
    if (!isAdmin) return setErr("Samo admin može dodavati sadržaj.");

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
      onSuccess?.();
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

  return (
    <form onSubmit={submit} className="space-y-4">
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
          placeholder="Trivia (opciono) — svaku stavku u novi red"
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
        <EpisodesEditor
          episodes={episodes}
          onChange={setEpisodes}
          errorText={errors.episodes}
        />
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
  );
}