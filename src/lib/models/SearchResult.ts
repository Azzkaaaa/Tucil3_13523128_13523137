import { Move } from "../utils/Move";

export interface SearchResult {
  success: boolean;
  path: Move[];
  nodesVisited: number;
  executionTime: number;
}
