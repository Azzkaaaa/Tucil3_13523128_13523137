"use client";

import React, { useState } from "react";
import useGameStore from "@/store/GameStore";
import { toast } from "sonner";

const Save = () => {
  const { solution, solutionPath, board, jumpToMove } = useGameStore();
  const [fileName, setFileName] = useState("RushPushSolution");
  const [showInput, setShowInput] = useState(false);

  if (!solution || solutionPath.length === 0) {
    return (
      <div className="p-4 rounded-lg border border-rush-primary bg-rush-secondary text-rush-primary">
        <p>Generate a solution first to enable saving</p>
      </div>
    );
  }

  const handleSave = () => {
    if (!showInput) {
      setShowInput(true);
      return;
    }

    // Stats
    let fileContent = "Rush Hour Solution\n";
    fileContent += "=================\n\n";
    fileContent += `Success: ${solution.success ? "Yes" : "No"}\n`;
    fileContent += `Nodes Visited: ${solution.nodesVisited}\n`;
    fileContent += `Execution Time: ${solution.executionTime.toFixed(2)} ms\n`;
    fileContent += `Total Moves: ${solutionPath.length}\n\n`;

    fileContent += "Initial Board State:\n";
    fileContent += "==================\n\n";

    // Get initial board state
    const initialBoard = board;
    if (!initialBoard) {
      toast.error("Error: Cannot access board state");
      setShowInput(false);
      return;
    }

    fileContent += initialBoard.printBoard() + "\n\n";

    fileContent += "Move Sequence:\n";
    fileContent += "=============\n\n";

    const currentIndex = useGameStore.getState().currentMoveIndex;

    // Generate each move and board state
    for (let index = 0; index < solutionPath.length; index++) {
      const move = solutionPath[index];

      // Log the move
      fileContent += `${index + 1}. ${move.pieceId}-${move.direction} (${move.steps} step${move.steps > 1 ? "s" : ""})\n\n`;

      jumpToMove(index);

      // Get the current board after this move
      const currentBoard = useGameStore.getState().getCurrentBoard();
      if (!currentBoard) continue;

      fileContent += `Board after move ${index + 1}:\n`;
      fileContent += currentBoard.printBoard() + "\n\n";
    }

    // Restore original state
    jumpToMove(currentIndex);

    // Create blob
    const blob = new Blob([fileContent], { type: "text/plain" });

    // Create URL blob
    const url = URL.createObjectURL(blob);

    // Create temporary anchor element, trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Reset state and show success message
    setShowInput(false);
    toast.success("Solution saved successfully!");
  };

  return (
    <div className="p-4 rounded-lg border border-rush-primary bg-rush-secondary text-rush-primary">
      <h3 className="text-xl font-semibold mb-3">Save Solution</h3>

      {showInput ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm">Enter a name for your solution file:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="border border-rush-accent-1 bg-rush-secondary px-3 py-1 rounded-lg flex-grow"
              placeholder="Enter filename"
            />
            <span className="text-rush-accent-1 flex items-center">.txt</span>
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex flex-col gap-2">
        <button
          onClick={handleSave}
          className="bg-rush-accent-1 text-rush-primary px-4 py-2 rounded-lg hover:bg-rush-accent-2 transition-colors">
          {showInput ? "Confirm & Save" : "Save"}
        </button>

        {showInput && (
          <button
            onClick={() => setShowInput(false)}
            className="bg-rush-secondary text-rush-primary px-4 py-2 rounded-lg border border-rush-primary hover:bg-rush-accent-2 hover:border-transparent transition-colors">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Save;
