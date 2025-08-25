
export type EpisodeItem = {
  episode_id: number;
  season_number: number;
  episode_number: number;
  title: string;
  description: string | null;
  cover_image: string | null;
};

export interface IEpisodeRepository {
  getEpisodes(contentId: number): Promise<EpisodeItem[]>;
}

  
