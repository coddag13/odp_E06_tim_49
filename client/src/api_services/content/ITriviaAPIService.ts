import type {TriviaItem } from "../../types/content/Trivia";

export interface ITriviaAPIService {
  getTrivia(id: number): Promise<TriviaItem[]>;
}
