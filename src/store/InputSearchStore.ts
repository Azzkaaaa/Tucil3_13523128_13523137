"use client";

import { Board } from "@/lib/models/Board";
import { create } from "zustand";

interface InputSearchState {
  selectedAlgorithm: string;
  selectedHeuristic: string;
  board: Board | null;

  setAlgorithm: (algorithm: string) => void;
  setHeuristic: (heuristic: string) => void;
  setBoard: (board: Board) => void;
}

export const useInputSearchStore = create<InputSearchState>((set) => ({
  selectedAlgorithm: "",
  selectedHeuristic: "",
  board: null,

  setAlgorithm: (algorithm: string) =>
    set({
      selectedAlgorithm: algorithm,
    }),
  setHeuristic: (heuristic: string) =>
    set({
      selectedHeuristic: heuristic,
    }),
  setBoard: (board: Board) =>
    set({
      board: board,
    }),
}));

export default useInputSearchStore;
