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
    return "bg-rush-accent-2/50";
  };

  return (
    <div className="p-5 bg-rush-primary rounded-2xl">
      {/* Top exit */}
      {exitRow === -1 && (
        <div className="flex">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={`top-${j}`}
              className={`w-12 h-12 flex items-center justify-center  m-1 rounded-xl border-rush-accent-2 border ${
                j === exitCol ? "bg-green-500" : "opacity-0"
              }`}>
              {j === exitCol && "K"}
            </div>
          ))}
        </div>
      )}

      {/* Main grid with left and right exits */}
      <div className="flex">
        {/* Left exit */}
        {exitCol === -1 && (
          <div className="flex flex-col">
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={`left-${i}`}
                className={`w-12 h-12 flex items-center justify-center m-1 rounded-xl border-rush-accent-2 border ${
                  i === exitRow ? "bg-green-500" : "opacity-0"
                }`}>
                {i === exitRow && "K"}
              </div>
            ))}
          </div>
        )}

        {/* Main grid */}
        <div className="flex flex-col">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={`row-${i}`} className="flex">
              {Array.from({ length: cols }).map((_, j) => (
                <div
                  key={`cell-${i}-${j}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl m-1 border-rush-accent-2 border ${getCellColor(grid[i][j])}`}>
                  {grid[i][j] !== "." ? grid[i][j] : ""}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right exit */}
        {exitCol === cols && (
          <div className="flex flex-col">
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={`right-${i}`}
                className={`w-12 h-12 flex items-center justify-center m-1 rounded-xl border-rush-accent-2 border ${
                  i === exitRow ? "bg-green-500" : "opacity-0"
                }`}>
                {i === exitRow && "K"}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom exit */}
      {exitRow === rows && (
        <div className="flex">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={`bottom-${j}`}
              className={`w-12 h-12 flex items-center justify-center  m-1 rounded-xl border-rush-accent-2 border ${
                j === exitCol ? "bg-green-500" : "opacity-0"
              }`}>
              {j === exitCol && "K"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderBoard;
