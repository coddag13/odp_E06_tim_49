export class EpisodeDto {
  constructor(
    public season_number: number,
    public episode_number: number,
    public title: string,
    public description: string | null = null,
    public cover_image: string | null = null
  ) {}
}