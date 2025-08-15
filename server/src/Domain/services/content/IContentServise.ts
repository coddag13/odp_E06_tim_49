import { ContentListItem, ContentFull, TriviaItem } from "../../repositories/content/IContentReporsitory";

export interface IContentService {
  list(params?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }): Promise<any[]>;
}
