import { Board } from "./Board";
import { Move } from "../utils/Move";

export class SearchNode {
  public board: Board;
  public parent: SearchNode | null;
  public move: Move | null;
  public cost: number;
  
  constructor(board: Board, parent: SearchNode | null = null, move: Move | null = null, cost: number = 0) {
    this.board = board;
    this.parent = parent;
    this.move = move;
    this.cost = cost;
  }
  
  // Get path from the root to this node
  getPath(): Move[] {
    const path: Move[] = [];
    
    this.buildPath(path);
    
    return path;
  }
  
  // Helper method to build the path recursively
  private buildPath(path: Move[]): void {
    if (this.parent === null || this.move === null) {
      return; // Base case: reached root node
    }
    
    this.parent.buildPath(path);
    
    path.push(this.move);
  }
  
  // Get string representation of the board for checking visited states
  getBoardString(): string {
    return this.board.getGrid().map(row => row.join('')).join('');
  }
}