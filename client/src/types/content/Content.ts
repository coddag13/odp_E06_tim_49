export type ContentType = "movie" | "series";

export interface ContentItem {
  content_id: number;
  title: string;
  type: ContentType;
  poster_url?: string | null;

  average_rating?: number | null;
  rating_count?: number | null;

  description?: string | null;
  release_date?: string | null;
  genre?: string | null;
}

export interface TriviaItem {
  trivia_id: number;
  trivia_text: string;
}
