"use client";

import React from "react";
import Loader from "./Loader";
import AlgoInput from "./AlgoInput";
import HeuristicInput from "./HeuristicInput";
import RenderBoard from "./RenderBoard";
import useGameStore, { AlgorithmType } from "@/store/GameStore";
import SolutionDisplay from "./Solution";

const InputSearch = () => {
  const { solvePuzzle, solution, resetSolution, selectedAlgorithm } = useGameStore();

  return (
    <div className="w-2/3 bg-rush-secondary rounded-2xl p-5 flex flex-col justify-center items-center">
      <div className="text-3xl font-bold">RushPush Solver</div>
      <div className="w-full p-5 flex justify-center items-center gap-10">
        <div className="flex flex-col gap-5 w-3/5">
          <Loader />
          {!solution && <RenderBoard activeMovePiece={null} />}
        </div>
        <div className="flex flex-col justify-center items-center gap-5 w-2/5">
          <AlgoInput />
          {selectedAlgorithm !== AlgorithmType.UCS && <HeuristicInput />}
          {!solution && (
            <button
              className="py-2 px-4 w-1/2 bg-rush-accent-2 rounded-3xl text-rush-secondary font-bold hover:cursor-pointer hover:bg-rush-primary/80 hover:text-rush-accent-1"
              onClick={solvePuzzle}>
              Start RushPush!
            </button>
          )}
        </div>
      </div>

      {solution && (
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <SolutionDisplay />
          <button
            onClick={resetSolution}
            className="py-2 px-4 w-1/3 bg-rush-accent-2 rounded-3xl text-rush-secondary font-bold hover:cursor-pointer hover:bg-rush-primary/80 hover:text-rush-accent-1">
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default InputSearch;
