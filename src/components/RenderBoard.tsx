import useGameStore from "@/store/GameStore";
import React from "react";

interface RenderBoardProps {
  activeMovePiece: string | null;
}

const RenderBoard: React.FC<RenderBoardProps> = ({ activeMovePiece }) => {
  const { getCurrentBoard } = useGameStore();
  const currentBoard = getCurrentBoard();
  if (!currentBoard) return null;

  const grid = currentBoard.getGrid();
  const exitRow = currentBoard.getExitRow();
  const exitCol = currentBoard.getExitCol();
  const rows = currentBoard.getRows();
  const cols = currentBoard.getCols();

  const getCellColor = (cellValue: string) => {
    if (cellValue === "P") {
      return "bg-red-500";
    }
    // Highlight move piece
    else if (cellValue === activeMovePiece) {
      return "bg-yellow-500";
    }
    // Other pieces
    // TODO: add unique color for each alphabet
    else if (cellValue !== ".") {
      return "bg-blue-500";
    }
    // Empty cell
    return "bg-gray-200";
  };

  return (
    <div className="flex flex-col items-center">
      {/* Top exit */}
      {exitRow === -1 && (
        <div className="flex">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={`top-${j}`}
              className={`w-12 h-6 flex items-center justify-center ${j === exitCol ? "bg-green-500" : "opacity-0"}`}>
              {j === exitCol && "K"}
            </div>
          ))}
        </div>
      )}

      {/* Grid rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`row-${i}`} className="flex">
          {/* Left exit */}
          {exitRow === i && exitCol === -1 && <div className="w-6 h-12 flex items-center justify-center bg-green-500">K</div>}

          {/* Grid cells */}
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={`cell-${i}-${j}`}
              className={`w-12 h-12 flex items-center justify-center border border-gray-400 ${getCellColor(grid[i][j])}`}>
              {grid[i][j]}
            </div>
          ))}

          {/* Right exit */}
          {exitRow === i && exitCol === cols && <div className="w-6 h-12 flex items-center justify-center bg-green-500">K</div>}
        </div>
      ))}

      {/* Bottom exit */}
      {exitRow === rows && (
        <div className="flex">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={`bottom-${j}`}
              className={`w-12 h-6 flex items-center justify-center ${j === exitCol ? "bg-green-500" : "opacity-0"}`}>
              {j === exitCol && "K"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderBoard;
