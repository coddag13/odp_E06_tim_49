import type { ContentItem, TriviaItem } from "../../types/content/Content";

export interface IContentAPIService {
  listContent(params?: { q?: string; type?: "movie" | "series"; genre?: string; page?: number; limit?: number }): Promise<ContentItem[]>;
  getContent(id: number): Promise<ContentItem>;
  getTrivia(id: number): Promise<TriviaItem[]>;
  rateContent(id: number, rating: number, token: string): Promise<{ success: boolean }>;
}
