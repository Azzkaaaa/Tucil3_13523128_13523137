"use client";

import { Board } from "../models/Board";
import { MovementManager, Move } from "../utils/Move";
import PriorityQueue from "ts-priority-queue";

// Node for the search tree
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

// Result of the search
export interface SearchResult {
  success: boolean;
  path: Move[];
  nodesVisited: number;
  executionTime: number;
}

// UCS Algorithm implementation
export class UCSAlgorithm {
  static search(initialBoard: Board): SearchResult {
    const startTime = performance.now();
    
    // Create priority queue ordered by path cost
    const priorityQueue = new PriorityQueue<SearchNode>({
      comparator: (a, b) => a.cost - b.cost
    });
    
    // Initialize the starting node
    const startNode = new SearchNode(initialBoard);
    priorityQueue.queue(startNode);
    
    // Set to keep track of visited states
    const visited = new Set<string>();
    visited.add(startNode.getBoardString());
    
    let nodesVisited = 0;
    
    while (priorityQueue.length > 0) {
      // Get the node with the lowest cost
      const current = priorityQueue.dequeue();
      nodesVisited++;
      
      // Check if we've reached the goal
      if (current.board.isGoal()) {
        const endTime = performance.now();
        return {
          success: true,
          path: current.getPath(),
          nodesVisited,
          executionTime: endTime - startTime
        };
      }
      
      // Get all possible moves from the current state
      const possibleMoves = MovementManager.getPossibleMoves(current.board);
      console.log("move: ", possibleMoves);
      
      for (const move of possibleMoves) {
        // Apply the move to get a new board state
        const newBoard = MovementManager.applyMove(current.board, move);
        const newBoardString = newBoard.getGrid().map(row => row.join('')).join('');
        
        // Skip if we've already visited this state
        if (visited.has(newBoardString)) {
          continue;
        }
        
        // Create a new node for this state
        const newNode = new SearchNode(
          newBoard,
          current,
          move,
          current.cost + 1 // increase cost each move
        );
        
        // Add the new state to the queue and mark it as visited
        priorityQueue.queue(newNode);
        visited.add(newBoardString);
      }
    }
    
    // If we've exhausted all possibilities without finding a solution
    const endTime = performance.now();
    return {
      success: false,
      path: [],
      nodesVisited,
      executionTime: endTime - startTime
    };
  }
}