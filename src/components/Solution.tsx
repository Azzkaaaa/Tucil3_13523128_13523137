"use client";

import React, { useEffect, useState } from "react";
import useGameStore from "@/store/GameStore";
import AlgoInput from "./AlgoInput";
import RenderBoard from "./RenderBoard";

const SolutionDisplay = () => {
  const {
    board,
    solution,
    solutionPath,
    currentMoveIndex,
    isAnimating,
    animationSpeed,
    solvePuzzle,
    resetSolution,
    nextMove,
    prevMove,
    jumpToMove,
    startAnimation,
    stopAnimation,
    setAnimationSpeed,
  } = useGameStore();

  const [activeMovePiece, setActiveMovePiece] = useState<string | null>(null);

  // Reset activeMovePiece when currentMoveIndex changes
  useEffect(() => {
    if (currentMoveIndex >= 0 && currentMoveIndex < solutionPath.length) {
      setActiveMovePiece(solutionPath[currentMoveIndex].pieceId);
    } else {
      setActiveMovePiece(null);
    }
  }, [currentMoveIndex, solutionPath]);

  if (!board) {
    return (
      <div className="p-6 rounded-2xl shadow-md bg-rush-primary text-rush-secondary">
        <p>Please load a board configuration first.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl shadow-md bg-rush-secondary text-rush-primary">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Rush Hour Puzzle</h2>
        <div className="flex gap-4">
          <AlgoInput />
          <button onClick={solvePuzzle} className="bg-rush-accent-1 text-rush-secondary px-4 py-2 rounded-lg">
            Solve Puzzle
          </button>
          {solution && (
            <button onClick={resetSolution} className="bg-rush-accent-2 text-rush-secondary px-4 py-2 rounded-lg">
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
            <RenderBoard activeMovePiece={activeMovePiece}/>
        </div>

        <div className="flex-1">
          {solution ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">Solution</h3>

              <div className="mb-4">
                <p>Success: {solution.success ? "yes" : "no"}</p>
                <p>Nodes Visited: {solution.nodesVisited}</p>
                <p>Execution Time: {solution.executionTime.toFixed(2)} ms</p>
                <p>Solution Length: {solutionPath.length} moves</p>
              </div>

              <div className="mb-4">
                <p className="mb-2">
                  Current Move: {currentMoveIndex + 1} / {solutionPath.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={prevMove}
                    disabled={currentMoveIndex < 0}
                    className="bg-rush-accent-1 text-rush-secondary px-3 py-1 rounded-lg disabled:opacity-50">
                    Prev
                  </button>
                  <button
                    onClick={nextMove}
                    disabled={currentMoveIndex >= solutionPath.length - 1}
                    className="bg-rush-accent-1 text-rush-secondary px-3 py-1 rounded-lg disabled:opacity-50">
                    Next
                  </button>
                  {!isAnimating ? (
                    <button
                      onClick={startAnimation}
                      disabled={currentMoveIndex >= solutionPath.length - 1}
                      className="bg-rush-accent-1 text-rush-secondary px-3 py-1 rounded-lg disabled:opacity-50">
                      Play
                    </button>
                  ) : (
                    <button onClick={stopAnimation} className="bg-rush-accent-2 text-rush-secondary px-3 py-1 rounded-lg">
                      Pause
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Animation Speed: {animationSpeed}ms</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="h-64 overflow-y-auto border border-rush-accent-2 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Move Sequence:</h4>
                <ul>
                  {solutionPath.map((move, index) => (
                    <li
                      key={index}
                      className={`mb-1 p-2 rounded cursor-pointer ${
                        index === currentMoveIndex ? "bg-rush-accent-1 text-rush-secondary" : ""
                      }`}
                      onClick={() => jumpToMove(index)}>
                      {index + 1}. {move.pieceId}-{move.direction} ({move.steps} step{move.steps > 1 ? "s" : ""})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl">Click {"Solve Puzzle"} to find a solution</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionDisplay;
