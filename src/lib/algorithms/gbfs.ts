"use client";

import { Board } from "../models/Board";
import { MovementManager } from "../utils/Move";
import { SearchNode } from "../models/SearchNode";
import PriorityQueue from "ts-priority-queue";
import { HeuristicType } from "@/store/GameStore";
import { SearchResult } from "../models/SearchResult";
import { Heuristics } from "./heuristics";

// Greedy Best-First Search Algorithm
export class GBFSAlgorithm {
  static search(initialBoard: Board, heuristicType: HeuristicType = HeuristicType.MANHATTAN): SearchResult {
    const startTime = performance.now();

    // Priority queue ordered only by heuristic value h(n)
    const priorityQueue = new PriorityQueue<SearchNode>({
      comparator: (a, b) => {
        const aHeuristic = Heuristics.calculateHeuristic(a.board, heuristicType);
        const bHeuristic = Heuristics.calculateHeuristic(b.board, heuristicType);

        return aHeuristic - bHeuristic;
      },
    });

    // Initialize starting node
    const startNode = new SearchNode(initialBoard);
    priorityQueue.queue(startNode);

    const visited = new Set<string>();
    visited.add(startNode.getBoardString());

    let nodesVisited = 0;

    while (priorityQueue.length > 0) {
      // Lowest heuristic value node
      const current = priorityQueue.dequeue();
      nodesVisited++;

      if (current.board.isGoal()) {
        const endTime = performance.now();
        return {
          success: true,
          path: current.getPath(),
          nodesVisited,
          executionTime: endTime - startTime,
        };
      }

      // All possible moves
      const possibleMoves = MovementManager.getPossibleMoves(current.board);

      for (const move of possibleMoves) {
        // Apply move
        const newBoard = MovementManager.applyMove(current.board, move);
        const newBoardString = newBoard
          .getGrid()
          .map((row) => row.join(""))
          .join("");

        if (visited.has(newBoardString)) {
          continue;
        }

        // Create new node with updated cost
        const newNode = new SearchNode(newBoard, current, move, current.cost + 1);

        priorityQueue.queue(newNode);
        visited.add(newBoardString);
      }
    }

    // No solution found
    const endTime = performance.now();
    return {
      success: false,
      path: [],
      nodesVisited,
      executionTime: endTime - startTime,
    };
  }
}
