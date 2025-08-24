export type ContentType = "movie" | "series";

export interface EpisodeInput {
  season_number: number;
  episode_number: number;
  title: string;
  description?: string | null;
  cover_image?: string | null;
}

export interface AddContentPayload {
  title: string;
  type: ContentType;
  description?: string | null;
  release_date?: string | null;   
  cover_image?: string | null;    
  genre?: string | null;
  trivia?: string | null;
  episodes?: EpisodeInput[];     
}