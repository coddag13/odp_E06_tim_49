import { ITriviaService } from "../../Domain/services/content/ITriviaService";
import { ITriviaRepository, TriviaItem } from "../../Domain/repositories/content/ITriviaReporsitory";

export class TriviService implements ITriviaService {
  constructor(private repo: ITriviaRepository) {}

  getTrivia(id: number) {
      return this.repo.getTrivia(id);
  }

}

