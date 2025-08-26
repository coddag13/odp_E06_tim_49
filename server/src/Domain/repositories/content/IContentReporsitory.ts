
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
  list(p?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }): Promise<any[]>;
  getById(id: number): Promise<any | null>;
  rate(contentId: number, rating: number): Promise<any>;
  
  create(dto: any): Promise<{ content_id: number }>;
}


  
