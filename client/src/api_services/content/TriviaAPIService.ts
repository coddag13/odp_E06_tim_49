import type { ITriviaAPIService } from "./ITriviaAPIService";
import type { TriviaItem } from "../../types/content/Trivia";

const RAW_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
const BASE = RAW_BASE.replace(/\/+$/, "");

function buildUrl(path: string) {
  return `${BASE}/${path.replace(/^\/+/, "")}`;
}

export const triviaApi: ITriviaAPIService = {
  async getTrivia(id: number): Promise<TriviaItem[]> {
    const res = await fetch(buildUrl(`content/${id}/trivia`)); 
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    if (Array.isArray(json)) return json as TriviaItem[];
    if (json && Array.isArray(json.data)) return json.data as TriviaItem[];
    return [];
  },
};
