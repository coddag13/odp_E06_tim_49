import { AddContentDto } from "../../DTOs/content/AddContentDto";

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

export interface IContentRepository {
  list(params?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }): Promise<ContentListItem[]>;
  getById(id: number): Promise<ContentFull | null>;
  rate(contentId: number, rating: number): Promise<{ content_id: number; average_rating: number; rating_count: number } | null>;
  create(dto: AddContentDto): Promise<{ content_id: number }>;
}


  
