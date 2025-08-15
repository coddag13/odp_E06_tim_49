import type { IContentAPIService } from "./IContentAPIService";
import type { ContentItem, TriviaItem } from "../../types/content/Content";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export const contentApi: IContentAPIService = {
  async listContent(params = {}) {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.type) qs.set("type", params.type);
    if (params.genre) qs.set("genre", params.genre);
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));

    const res = await fetch(`${BASE}/api/content?${qs.toString()}`);
    if (!res.ok) throw new Error("Neuspelo učitavanje kataloga");
    return (await res.json()) as ContentItem[];
  },

  async getContent(id: number) {
    const res = await fetch(`${BASE}/api/content/${id}`);
    if (!res.ok) throw new Error("Neuspelo učitavanje sadržaja");
    return (await res.json()) as ContentItem;
  },

  async getTrivia(id: number) {
    const res = await fetch(`${BASE}/api/content/${id}/trivia`);
    if (!res.ok) throw new Error("Neuspelo učitavanje trivie");
    return (await res.json()) as TriviaItem[];
  },

  async rateContent(id: number, rating: number, token: string) {
    const res = await fetch(`${BASE}/api/content/${id}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Neuspelo slanje ocene");
    return { success: true };
  },
};
