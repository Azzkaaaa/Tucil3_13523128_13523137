"use client";

import { Board } from "../models/Board";
import { MovementManager } from "../utils/Move";
import { SearchNode } from "../models/SearchNode";
import { HeuristicType } from "@/store/GameStore";
import { SearchResult } from "../models/SearchResult";
import { Heuristics } from "./heuristics";
import PriorityQueue from "ts-priority-queue";

// Beam Search Algorithm
export class BeamSearchAlgorithm {
  static search(
    initialBoard: Board,
    heuristicType: HeuristicType = HeuristicType.MANHATTAN,
    beamWidth: number = 5 // default
  ): SearchResult {
    const startTime = performance.now();

    // Initialize
    const startNode = new SearchNode(initialBoard);
    let beam: SearchNode[] = [startNode];

    const visited = new Set<string>();
    visited.add(startNode.getBoardString());

    let nodesVisited = 0;
    let maxBeamSize = 1;

    const beamSizeHistory: number[] = [1];
    let depthReached = 0;

    // Search loop
    while (beam.length > 0) {
      depthReached++;
      
      // Priority queue for successors
      const successorQueue = new PriorityQueue<SearchNode>({
        comparator: (a, b) => {
          const aHeuristic = Heuristics.calculateHeuristic(a.board, heuristicType);
          const bHeuristic = Heuristics.calculateHeuristic(b.board, heuristicType);
          return aHeuristic - bHeuristic;
        }
      });

      for (const node of beam) {
        nodesVisited++;

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

        // All possible moves
        const possibleMoves = MovementManager.getPossibleMoves(node.board);

        // Create successor nodes
        for (const move of possibleMoves) {
          const newBoard = MovementManager.applyMove(node.board, move);
          const boardString = newBoard
            .getGrid()
            .map((row) => row.join(""))
            .join("");

          if (visited.has(boardString)) {
            continue;
          }
          visited.add(boardString);

          // Create new node
          const newNode = new SearchNode(
            newBoard,
            node,
            move,
            node.cost + 1 // g(n) = parent's g(n) + 1
          );

          // Add to priority queue
          successorQueue.queue(newNode);
        }
      }

      // If no successors, failed
      if (successorQueue.length === 0) {
        const endTime = performance.now();
        
        return {
          success: false,
          path: [],
          nodesVisited,
          executionTime: endTime - startTime,
        };
      }

      // Top k nodes from priority queue
      beam = [];
      const count = Math.min(beamWidth, successorQueue.length);
      for (let i = 0; i < count; i++) {
        beam.push(successorQueue.dequeue());
      }

      maxBeamSize = Math.max(maxBeamSize, beam.length);
      beamSizeHistory.push(beam.length);
    }

    // Beam empty and no solution found
    const endTime = performance.now();
    return {
      success: false,
      path: [],
      nodesVisited,
      executionTime: endTime - startTime,
    };
  }
}