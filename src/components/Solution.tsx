"use client";

import React, { useEffect, useState } from "react";
import useGameStore from "@/store/GameStore";
import RenderBoard from "./RenderBoard";

const SolutionDisplay = () => {
  const {
    board,
    solution,
    solutionPath,
    currentMoveIndex,
    isAnimating,
    animationSpeed,
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
    <div className="p-6 rounded-2xl border-rush-primary border-3 bg-rush-secondary text-rush-primary w-full">
      <div className="flex justify-center items-center gap-10 w-full">
        <RenderBoard activeMovePiece={activeMovePiece} />

        {solution && (
          <div className="w-1/2">
            <h3 className="text-2xl font-semibold">Solution</h3>
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
                  className="bg-rush-accent-1 text-rush-primary px-3 py-1 rounded-lg disabled:opacity-50">
                  Prev
                </button>
                <button
                  onClick={nextMove}
                  disabled={currentMoveIndex >= solutionPath.length - 1}
                  className="bg-rush-accent-1 text-rush-primary px-3 py-1 rounded-lg disabled:opacity-50">
                  Next
                </button>
                {!isAnimating ? (
                  <button
                    onClick={startAnimation}
                    disabled={currentMoveIndex >= solutionPath.length - 1}
                    className="bg-rush-accent-1 text-rush-accent-2 px-3 py-1 rounded-lg disabled:opacity-50">
                    Play
                  </button>
                ) : (
                  <button onClick={stopAnimation} className="bg-rush-accent-2 text-rush-secondary px-3 py-1 rounded-lg">
                    Pause
                  </button>
                )}
                <button
                  onClick={() => jumpToMove(-1)}
                  disabled={currentMoveIndex < 0}
                  className="bg-rush-accent-1 text-rush-primary px-3 py-1 rounded-lg disabled:opacity-50">
                  Reset
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Animation Speed: {animationSpeed}ms</label>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <h4 className="text-lg font-medium mb-2">Move Sequence:</h4>
            <div className="h-64 overflow-y-auto border border-rush-accent-2 p-4 rounded-lg">
              <ul>
                {solutionPath.map((move, index) => (
                  <li
                    key={index}
                    className={`mb-1 p-2 rounded cursor-pointer ${
                      index === currentMoveIndex ? "bg-rush-primary text-rush-accent-2" : ""
                    }`}
                    onClick={() => jumpToMove(index)}>
                    {index + 1}. {move.pieceId}-{move.direction} ({move.steps} step{move.steps > 1 ? "s" : ""})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionDisplay;
