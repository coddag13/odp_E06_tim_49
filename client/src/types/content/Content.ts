export type ContentType = "movie" | "series";

export interface ContentItem {
  content_id: number;
  title: string;
  description: string;
  release_date?: string | null;
  cover_image?: string | null;
  genre?: string | null;
  type: ContentType;
  average_rating: number; 
  rating_count: number;   
}

export interface Episode {
  episode_id: number;
  season_number: number;
  episode_number: number;
  title: string;
  description?: string | null;
  cover_image?: string | null;
}

export interface TriviaItem {
  trivia_id: number;
  trivia_text: string;
}
