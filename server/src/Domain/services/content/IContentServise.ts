import { AddContentDto } from "../../DTOs/content/AddContentDto";
import type {
  ContentListItem,
  ContentFull,
  TriviaItem,
} from "../../repositories/content/IContentReporsitory";

export interface IContentService {
  getEpisodes(id: number): unknown;
  list(params?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }): Promise<ContentListItem[]>;
  getById(id: number): Promise<ContentFull | null>;
  getTrivia(id: number): Promise<TriviaItem[]>;
  rate(contentId: number, rating: number, userId: number): Promise<{ content_id: number; average_rating: number; rating_count: number } | null>;
  create(dto: AddContentDto): Promise<{ content_id: number }>;
}
