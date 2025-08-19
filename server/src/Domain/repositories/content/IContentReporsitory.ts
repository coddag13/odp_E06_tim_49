import { AddContentDto } from "../../DTOs/content/AddContentDto";

export type EpisodeItem = {
  episode_id: number;
  season_number: number;
  episode_number: number;
  title: string;
  description: string | null;
  cover_image: string | null;
};


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

export interface TriviaItem {
  trivia_id: number;
  trivia_text: string;
}

export interface IContentRepository {
  list(params?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }): Promise<ContentListItem[]>;
  getById(id: number): Promise<ContentFull | null>;
  getTrivia(id: number): Promise<TriviaItem[]>;
  rate(contentId: number, rating: number): Promise<{ content_id: number; average_rating: number; rating_count: number } | null>;
  getEpisodes(contentId: number): Promise<EpisodeItem[]>;
  create(dto: AddContentDto): Promise<{ content_id: number }>;
}


  
