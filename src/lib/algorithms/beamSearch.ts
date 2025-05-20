"use client";

import { Board } from "../models/Board";
import { MovementManager } from "../utils/Move";
import { SearchNode } from "../models/SearchNode";
import { HeuristicType } from "@/store/GameStore";
import { SearchResult } from "../models/SearchResult";
import { Heuristics } from "./heuristics";

// Beam Search Algorithm
export class BeamSearchAlgorithm {
  static search(
    initialBoard: Board,
    heuristicType: HeuristicType = HeuristicType.MANHATTAN,
    beamWidth: number = 5 // default
  ): SearchResult {
    const startTime = performance.now();

    // Initialize the starting node
    const startNode = new SearchNode(initialBoard);

    // Initialize beam with starting node
    let beam: SearchNode[] = [startNode];

    // Keep track of visited states to avoid cycles
    const visited = new Set<string>();
    visited.add(startNode.getBoardString());

    let nodesVisited = 0;
    let maxBeamSize = 1;

    // For statistics
    const beamSizeHistory: number[] = [1];
    let depthReached = 0;

    // Main search loop
    while (beam.length > 0) {
      depthReached++;

      // Get all successor nodes for the current beam
      const successors: SearchNode[] = [];

      for (const node of beam) {
        nodesVisited++;

        // Check if node is goal
        if (node.board.isGoal()) {
          const endTime = performance.now();
          const executionTime = endTime - startTime;

          // Calculate average beam size
          const avgBeamSize = beamSizeHistory.reduce((a, b) => a + b, 0) / beamSizeHistory.length;

          console.log(`Beam Search found solution at depth ${depthReached}`);
          console.log(`Visited ${nodesVisited} nodes with max beam size ${maxBeamSize}`);
          console.log(`Average beam size: ${avgBeamSize.toFixed(2)}`);

          return {
            success: true,
            path: node.getPath(),
            nodesVisited,
            executionTime,
          };
        }

        // Get all possible moves for this node
        const possibleMoves = MovementManager.getPossibleMoves(node.board);

        // Create successor nodes for each possible move
        for (const move of possibleMoves) {
          const newBoard = MovementManager.applyMove(node.board, move);
          const boardString = newBoard
            .getGrid()
            .map((row) => row.join(""))
            .join("");

          // Skip if this state has been visited
          if (visited.has(boardString)) {
            continue;
          }

          // Mark as visited
          visited.add(boardString);

          // Create new node
          const newNode = new SearchNode(
            newBoard,
            node,
            move,
            node.cost + 1 // g(n) = parent's g(n) + 1
          );

          // Add to successors
          successors.push(newNode);
        }
      }

      // If no successors, the search has failed
      if (successors.length === 0) {
        const endTime = performance.now();
        console.log(`Beam Search failed after exploring ${nodesVisited} nodes`);

        return {
          success: false,
          path: [],
          nodesVisited,
          executionTime: endTime - startTime,
        };
      }

      // Sort successors by heuristic value
      successors.sort((a, b) => {
        const aHeuristic = Heuristics.calculateHeuristic(a.board, heuristicType);
        const bHeuristic = Heuristics.calculateHeuristic(b.board, heuristicType);
        return aHeuristic - bHeuristic;
      });

      // Keep only the best nodes up to beam width
      beam = successors.slice(0, beamWidth);

      // Update statistics
      maxBeamSize = Math.max(maxBeamSize, beam.length);
      beamSizeHistory.push(beam.length);

      // Safety check: break if we've reached a very large depth or explored too many nodes
      if (depthReached > 1000 || nodesVisited > 100000) {
        const endTime = performance.now();
        console.warn(`Beam Search exceeded limits: depth=${depthReached}, nodes=${nodesVisited}`);

        return {
          success: false,
          path: [],
          nodesVisited,
          executionTime: endTime - startTime,
        };
      }
    }

    // If beam is empty and no solution found
    const endTime = performance.now();
    return {
      success: false,
      path: [],
      nodesVisited,
      executionTime: endTime - startTime,
    };
  }

  // Override getName for this algorithm
  static getName(): string {
    return "BeamSearch";
  }

  // Override getDescription for this algorithm
  static getDescription(): string {
    return "Beam Search explores a limited number of the most promising nodes at each level, combining the efficiency of greedy search with some breadth.";
  }
}