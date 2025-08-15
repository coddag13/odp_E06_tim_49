export interface ContentListItem {
  content_id: number;
  title: string;
  type: "movie" | "series";
  poster_url: string | null;
  average_rating: number | null;
  rating_count: number | null;
}
export interface ContentFull extends ContentListItem {
  description: string | null;
  release_date: string | null;
  genre: string | null;
}
export interface TriviaItem { trivia_id: number; trivia_text: string; }
export interface IContentRepository {
  list(params?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }): Promise<any[]>;
}
