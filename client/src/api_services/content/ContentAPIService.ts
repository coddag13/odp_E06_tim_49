import type { IContentAPIService } from "./IContentAPIService";
import type { ContentItem, TriviaItem } from "../../types/content/Content";
import type { AddContentPayload } from "../../types/content/AddContent";
import type { EpisodeItem } from "../../types/content/Content";
const RAW_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
const BASE = RAW_BASE.replace(/\/+$/, "");

function buildUrl(path: string, qs?: Record<string, any>) {
  const u = new URL(`${BASE}/${path.replace(/^\/+/, "")}`);
  if (qs) {
    Object.entries(qs).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== "") {
        u.searchParams.set(k, String(v));
      }
    });
  }
  return u.toString();
}

export const contentApi: IContentAPIService = {
  async listContent(params = {}) {
    const res = await fetch(buildUrl("content", params));
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Catalog HTTP ${res.status}: ${txt || res.statusText}`);
    }
    const raw = (await res.json()) as ContentItem[];

    // ⬇️ Normalizacija decimalnih/brojčanih polja (MySQL DECIMAL često stiže kao string)
    return raw.map((it) => ({
      ...it,
      average_rating: it.average_rating != null ? Number(it.average_rating) : null,
      rating_count: it.rating_count != null ? Number(it.rating_count) : null,
    }));
  },
  async getEpisodes(id: number) {
  const res = await fetch(buildUrl(`content/${id}/episodes`));
  if (!res.ok) throw new Error("Neuspelo učitavanje epizoda");
  return (await res.json()) as EpisodeItem[];
  },
  async getContent(id: number) {
    const res = await fetch(buildUrl(`content/${id}`));
    if (!res.ok) throw new Error("Neuspelo učitavanje sadržaja");

    const it = (await res.json()) as ContentItem;

    // ⬇️ Normalizacija i za single item
    return {
      ...it,
      average_rating: it.average_rating != null ? Number(it.average_rating) : null,
      rating_count: it.rating_count != null ? Number(it.rating_count) : null,
    };
  },

  async getTrivia(id: number) {
    const res = await fetch(buildUrl(`content/${id}/trivia`));
    if (!res.ok) throw new Error("Neuspelo učitavanje trivie");
    return (await res.json()) as TriviaItem[];
  },

  async rateContent(id: number, rating: number, token: string) {
    const res = await fetch(buildUrl(`content/${id}/rate`), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rating }),
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Neuspelo slanje ocene (${res.status})`);
    return { success: true };
  },

  // (opciono) admin dodavanje sadržaja
  async createContent(payload: AddContentPayload, token: string) {
    const res = await fetch(buildUrl("content"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (json as any)?.message || (json as any)?.detail || `Greška pri dodavanju (${res.status})`;
      throw new Error(msg);
    }
    // backend vraća { success: true, data: { content_id } }
    return (json as any)?.data as { content_id: number };
  },
};