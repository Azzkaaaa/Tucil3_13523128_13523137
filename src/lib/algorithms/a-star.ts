"use client";

import { Board } from "../models/Board";
import { MovementManager } from "../utils/Move";
import { SearchNode } from "../models/SearchNode";
import PriorityQueue from "ts-priority-queue";
import { HeuristicType } from "@/store/GameStore";
import { SearchResult } from "../models/SearchResult";
import { Heuristics } from "./heuristics";

// A* Algorithm
export class AStarAlgorithm {
  static search(initialBoard: Board, heuristicType: HeuristicType = HeuristicType.MANHATTAN): SearchResult {
    const startTime = performance.now();

    // Priority queue ordered by f(n) = g(n) + h(n)
    // g(n) = cost so far; h(n) = heuristic cost
    const priorityQueue = new PriorityQueue<SearchNode>({
      comparator: (a, b) => {
        const aHeuristic = Heuristics.calculateHeuristic(a.board, heuristicType);
        const bHeuristic = Heuristics.calculateHeuristic(b.board, heuristicType);
        const aTotal = a.cost + aHeuristic;
        const bTotal = b.cost + bHeuristic;

        return aTotal - bTotal;
      },
    });

    // Initialize starting node
    const startNode = new SearchNode(initialBoard);
    priorityQueue.queue(startNode);

    const visited = new Set<string>();
    visited.add(startNode.getBoardString());

    let nodesVisited = 0;

    while (priorityQueue.length > 0) {
      // Lowest f(n) node
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

        // Create new node
        const newNode = new SearchNode(
          newBoard,
          current,
          move,
          current.cost + 1 // g(n) = parent's g(n) + 1
        );

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
