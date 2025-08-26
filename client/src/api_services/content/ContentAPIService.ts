import type { IContentAPIService } from "./IContentAPIService";
import type { ContentItem } from "../../types/content/Content";
import type { AddContentPayload } from "../../types/content/AddContent";

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

    const raw = (await res.json()) as any;

    
    const payload = raw && typeof raw === "object" && "data" in raw ? raw.data : raw;
    const arr: ContentItem[] = Array.isArray(payload) ? payload : [];

    return arr.map((it) => ({
      ...it,
      average_rating:
        it.average_rating !== undefined && it.average_rating !== null
          ? Number(it.average_rating)
          : null,
      rating_count:
        it.rating_count !== undefined && it.rating_count !== null
          ? Number(it.rating_count)
          : null,
    }));
  },

  async getContent(id: number) {
    const res = await fetch(buildUrl(`content/${id}`));
    if (!res.ok) throw new Error("Neuspelo učitavanje sadržaja");

    const raw = (await res.json()) as any;

    
    const it: ContentItem = (raw && typeof raw === "object" && "data" in raw ? raw.data : raw) as ContentItem;

    return {
      ...it,
      average_rating:
        it.average_rating !== undefined && it.average_rating !== null
          ? Number(it.average_rating)
          : null,
      rating_count:
        it.rating_count !== undefined && it.rating_count !== null
          ? Number(it.rating_count)
          : null,
    };
  },

  async rateContent(id: number, rating: number, token: string) {
  const res = await fetch(buildUrl(`content/${id}/rate`), {
    method: "POST",
  
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,

    },
  
    body: JSON.stringify({ rating }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Neuspelo slanje ocene (${res.status})${txt ? ` - ${txt}` : ""}`);
  }
  return { success: true };
},

  async createContent(payload: AddContentPayload, token: string) {
  const res = await fetch(buildUrl("content"), {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (json as any)?.message ||
      (json as any)?.detail ||
      `Greška pri dodavanju (${res.status})`;
    throw new Error(msg);
  }
  return (json as any)?.data as { content_id: number };
}
};