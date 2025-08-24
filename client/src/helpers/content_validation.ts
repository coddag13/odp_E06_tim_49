import type { ContentType } from "../types/content/AddContent";
import type { EpisodeInput } from "../types/content/AddContent";

export type FieldErrors = Partial<{
  title: string;
  release_date: string;
  cover_image: string;
  genre: string;
  trivia: string;
  episodes: string;
}>;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateISO(d: string) {
  if (!DATE_RE.test(d)) return false;
  const dt = new Date(d);
  const [y, m, day] = d.split("-").map(Number);
  return (
    !Number.isNaN(dt.getTime()) &&
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() + 1 === m &&
    dt.getUTCDate() === day
  );
}

export function isValidUrl(str: string) {
  if (!str) return false;
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateContentForm(args: {
  type: ContentType;
  title: string;
  release_date: string;
  cover_image: string;
  genre: string;
  trivia: string;
  episodes: EpisodeInput[];
}): FieldErrors {
  const { type, title, release_date, cover_image, genre, trivia, episodes } = args;
  const errors: FieldErrors = {};

  const t = title.trim();
  if (!t) errors.title = "Naslov je obavezan.";
  else if (t.length < 2) errors.title = "Naslov mora imati bar 2 znaka.";
  else if (t.length > 150) errors.title = "Naslov je predugačak (max 150).";

  if (release_date.trim()) {
    if (!isValidDateISO(release_date.trim())) {
      errors.release_date = "Datum mora biti validan i formata YYYY-MM-DD.";
    }
  }

  if (cover_image.trim() && !isValidUrl(cover_image.trim())) {
    errors.cover_image = "Cover mora biti validan URL (http/https).";
  }

  if (genre && genre.length > 50) errors.genre = "Žanr je predugačak (max 50).";
  if (trivia && trivia.length > 500) errors.trivia = "Trivia je predugačka (max 500).";

  if (type === "series") {
    if (episodes.length === 0) {
      errors.episodes = "Dodaj bar jednu epizodu.";
    } else {
      const seen = new Set<string>();
      for (let i = 0; i < episodes.length; i++) {
        const ep = episodes[i];

        if (!Number.isInteger(ep.season_number) || ep.season_number < 1) {
          errors.episodes = `Epizoda #${i + 1}: sezona mora biti ceo broj ≥ 1.`;
          break;
        }
        if (!Number.isInteger(ep.episode_number) || ep.episode_number < 1) {
          errors.episodes = `Epizoda #${i + 1}: epizoda mora biti ceo broj ≥ 1.`;
          break;
        }
        if (!ep.title?.trim()) {
          errors.episodes = `Epizoda #${i + 1}: naziv je obavezan.`;
          break;
        }

        const key = `${ep.season_number}-${ep.episode_number}`;
        if (seen.has(key)) {
          errors.episodes = `Duplikat epizode (S${ep.season_number}E${ep.episode_number}).`;
          break;
        }
        seen.add(key);

        if (ep.cover_image && !isValidUrl(ep.cover_image)) {
          errors.episodes = `Epizoda #${i + 1}: cover nije validan URL.`;
          break;
        }
        if (ep.description && ep.description.length > 500) {
          errors.episodes = `Epizoda #${i + 1}: opis je predugačak (max 500).`;
          break;
        }
      }
    }
  }

  return errors;
}
