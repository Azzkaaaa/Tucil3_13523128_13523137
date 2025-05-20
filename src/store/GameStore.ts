"use client";

import { create } from "zustand";
import { Board } from "@/lib/models/Board";
import { Move, MovementManager } from "@/lib/utils/Move";
import { UCSAlgorithm } from "@/lib/algorithms/ucs";
import { AStarAlgorithm } from "@/lib/algorithms/a-star";
import { GBFSAlgorithm } from "@/lib/algorithms/gbfs";
import { SearchResult } from "@/lib/models/SearchResult";

// Algorithm Type
export enum AlgorithmType {
  UCS = "ucs",
  GBFS = "gbfs",
  ASTAR = "a-star",
}

// Heuristic Type
export enum HeuristicType {
  MANHATTAN = "manhattan",
  BLOCKING = "blocking",
  DISTANCE = "distance",
}

// Game State
interface GameState {
  board: Board | null;
  selectedAlgorithm: AlgorithmType;
  selectedHeuristic: HeuristicType;
  solution: SearchResult | null;
  solutionPath: Move[];
  currentMoveIndex: number;
  isAnimating: boolean;
  animationSpeed: number;

  setBoard: (board: Board) => void;
  setAlgorithm: (algorithm: AlgorithmType) => void;
  setHeuristic: (heuristic: HeuristicType) => void;
  solvePuzzle: () => void;
  resetSolution: () => void;
  nextMove: () => void;
  prevMove: () => void;
  jumpToMove: (index: number) => void;
  startAnimation: () => void;
  stopAnimation: () => void;
  setAnimationSpeed: (speed: number) => void;
  getCurrentBoard: () => Board | null;
}

// Create store
const useGameStore = create<GameState>((set, get) => ({
  board: null,
  selectedAlgorithm: AlgorithmType.UCS,
  selectedHeuristic: HeuristicType.MANHATTAN,
  solution: null,
  solutionPath: [],
  currentMoveIndex: -1,
  isAnimating: false,
  animationSpeed: 500, // milliseconds per move

  setBoard: (board) =>
    set({
      board,
      solution: null,
      solutionPath: [],
      currentMoveIndex: -1,
      isAnimating: false,
    }),

  setAlgorithm: (algorithm) => set({ selectedAlgorithm: algorithm }),

  setHeuristic: (heuristic) => set({ selectedHeuristic: heuristic }),

  solvePuzzle: () => {
    const { board, selectedAlgorithm, selectedHeuristic } = get();
    if (!board) return;

    let solution: SearchResult | null = null;

    switch (selectedAlgorithm) {
      case AlgorithmType.UCS:
        solution = UCSAlgorithm.search(board);
        break;
      case AlgorithmType.ASTAR:
        solution = AStarAlgorithm.search(board, selectedHeuristic);
        break;
      case AlgorithmType.GBFS:
        solution = GBFSAlgorithm.search(board, selectedHeuristic);
        break;
      default:
        solution = UCSAlgorithm.search(board);
    }

    set({
      solution,
      solutionPath: solution.path,
      currentMoveIndex: -1,
    });
  },

  resetSolution: () =>
    set({
      solution: null,
      solutionPath: [],
      currentMoveIndex: -1,
      isAnimating: false,
    }),

  nextMove: () => {
    const { board, solutionPath, currentMoveIndex } = get();
    if (!board || currentMoveIndex >= solutionPath.length - 1) return;

    const nextIndex = currentMoveIndex + 1;
    set({ currentMoveIndex: nextIndex });
  },

  prevMove: () => {
    const { currentMoveIndex } = get();
    if (currentMoveIndex <= -1) return;

    const prevIndex = currentMoveIndex - 1;
    set({ currentMoveIndex: prevIndex });
  },

  jumpToMove: (index) => {
    const { solutionPath } = get();
    if (index < -1 || index >= solutionPath.length) return;

    set({ currentMoveIndex: index });
  },

  startAnimation: () => {
    const { isAnimating, solutionPath, currentMoveIndex } = get();
    if (isAnimating || currentMoveIndex >= solutionPath.length - 1) return;

    set({ isAnimating: true });

    const animate = () => {
      const { isAnimating, solutionPath, currentMoveIndex, animationSpeed } = get();

      if (!isAnimating || currentMoveIndex >= solutionPath.length - 1) {
        set({ isAnimating: false });
        return;
      }

      // Move to next step
      get().nextMove();

      // Schedule next animation frame
      setTimeout(animate, animationSpeed);
    };

    // Start animation
    setTimeout(animate, get().animationSpeed);
  },

  stopAnimation: () => set({ isAnimating: false }),

  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),

  getCurrentBoard: () => {
    const { board, solutionPath, currentMoveIndex } = get();
    if (!board || currentMoveIndex < 0) return board;

    // Apply all moves
    let currentBoard = board.copy();
    for (let i = 0; i <= currentMoveIndex; i++) {
      const move = solutionPath[i];
      currentBoard = MovementManager.applyMove(currentBoard, move);
    }

    return currentBoard;
  },
}));

export default useGameStore;
