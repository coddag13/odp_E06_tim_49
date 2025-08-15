import type { IContentAPIService } from "./IContentAPIService";
import type { ContentItem, TriviaItem } from "../../types/content/Content";

const RAW_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
const BASE = RAW_BASE.replace(/\/+$/, "");

// Spaja BASE + path i dodaje query parametre bez duplih / i ?&
function buildUrl(path: string, qs?: Record<string, any>) {
  const clean = path.replace(/^\/+/, "");
  const u = new URL(`${BASE}/${clean}`);
  if (qs) {
    for (const [k, v] of Object.entries(qs)) {
      if (v !== undefined && v !== null && String(v) !== "") {
        u.searchParams.set(k, String(v));
      }
    }
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
    return (await res.json()) as ContentItem[];
  },

  async getContent(id: number) {
    const res = await fetch(buildUrl(`content/${id}`));
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Content HTTP ${res.status}: ${txt || res.statusText}`);
    }
    return (await res.json()) as ContentItem;
  },

  async getTrivia(id: number) {
    const res = await fetch(buildUrl(`content/${id}/trivia`));
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Trivia HTTP ${res.status}: ${txt || res.statusText}`);
    }
    return (await res.json()) as TriviaItem[];
  },

  async rateContent(id: number, rating: number, token: string) {
    const res = await fetch(buildUrl(`content/${id}/rate`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating }),
      credentials: "include",
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Rate HTTP ${res.status}: ${txt || res.statusText}`);
    }
    return { success: true };
  },
};
