import type {
  TriviaItem,
} from "../../repositories/content/ITriviaReporsitory";

export interface ITriviaService {
  getTrivia(id: number): Promise<TriviaItem[]>;
}
