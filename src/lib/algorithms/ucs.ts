"use client";

import { Board } from "../models/Board";
import { MovementManager } from "../utils/Move";
import { SearchNode } from "../models/SearchNode";
import PriorityQueue from "ts-priority-queue";
import { SearchResult } from "../models/SearchResult";

// UCS Algorithm
export class UCSAlgorithm {
  static search(initialBoard: Board): SearchResult {
    const startTime = performance.now();
    
    // Priority queue ordered by path cost
    const priorityQueue = new PriorityQueue<SearchNode>({
      comparator: (a, b) => a.cost - b.cost
    });
    
    // Initialize starting node
    const startNode = new SearchNode(initialBoard);
    priorityQueue.queue(startNode);
    
    const visited = new Set<string>();
    visited.add(startNode.getBoardString());
    
    let nodesVisited = 0;
    while (priorityQueue.length > 0) {
      // Node with lowest cost
      const current = priorityQueue.dequeue();
      nodesVisited++;
      
      if (current.board.isGoal()) {
        const endTime = performance.now();
        return {
          success: true,
          path: current.getPath(),
          nodesVisited,
          executionTime: endTime - startTime
        };
      }
      
      // All possible moves
      const possibleMoves = MovementManager.getPossibleMoves(current.board);
      
      for (const move of possibleMoves) {
        // Apply move
        const newBoard = MovementManager.applyMove(current.board, move);
        const newBoardString = newBoard.getGrid().map(row => row.join('')).join('');
        
        if (visited.has(newBoardString)) {
          continue;
        }
        
        // Create new node
        const newNode = new SearchNode(
          newBoard,
          current,
          move,
          current.cost + 1 // increase cost each move
        );
        
        // Add the new node
        priorityQueue.queue(newNode);
        visited.add(newBoardString);
      }
    }
    
    const endTime = performance.now();
    return {
      success: false,
      path: [],
      nodesVisited,
      executionTime: endTime - startTime
    };
  }
}