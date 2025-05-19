import { Board } from "../models/Board";
import { Piece } from "../models/Piece";

class ConcretePiece implements Piece {
  constructor(
    public id: string,
    public row: number,
    public col: number,
    public length: number,
    public isHorizontal: boolean,
    public isPrimary: boolean
  ) {}

  copy(): Piece {
    return new ConcretePiece(this.id, this.row, this.col, this.length, this.isHorizontal, this.isPrimary);
  }
}

export function parseBoardFromString(content: string): Board | null {
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");

  const [A, B] = lines[0].split(" ").map(Number);
  const rows = A;
  const cols = B;

  let exitRow = -1;
  let exitCol = -1;

  // === Find K (exit) ===
  // (Top exit)
  if (lines.length > 2 && lines[2].includes("K")) {
    exitRow = -1;
    exitCol = lines[2].indexOf("K");
  } else {
    // (Bottom exit)
    const bottomLine = lines[2 + rows];
    if (bottomLine && bottomLine.includes("K")) {
      exitRow = rows;
      exitCol = bottomLine.indexOf("K");
    } else {
      // (Left or right exit)
      for (let i = 0; i < rows; i++) {
        const line = lines[2 + i];
        if (line[0] === "K") {
          exitRow = i;
          exitCol = -1;
          break;
        } else if (line.length > cols && line[cols] === "K") {
          exitRow = i;
          exitCol = cols;
          break;
        }
      }
    }
  }

  // Alert K position
  if (
    (exitRow === -1 && exitCol === -1) ||
    (exitRow === -1 && exitCol === cols) ||
    (exitRow === rows && exitCol === cols) ||
    (exitRow === rows && exitCol === -1) ||
    exitRow < -1 ||
    exitCol < -1 ||
    exitRow > rows ||
    exitCol > cols
  ) {
    alert("Exit should intact horizontally / vertically with cars");
  }

  // Make grid
  let initialRow = 0;
  let initialCol = 0;
  if (exitRow === -1) {
    initialRow = 1;
  } else if (exitCol === -1) {
    initialCol = 1;
  }
  const gridLines = lines.slice(2 + initialRow, 2 + rows + initialRow);
  const grid: string[][] = gridLines.map((line) => line.slice(0 + initialCol, cols + initialCol).split(""));
  const pieces = new Map<string, Piece>();

  // === Parse pieces ===
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const symbol = grid[i][j];
      if (symbol === "." || pieces.has(symbol)) continue;

      let length = 1;
      let isHorizontal = false;

      // If horizontal
      if (j + 1 < cols && grid[i][j + 1] === symbol) {
        isHorizontal = true;
        let k = j + 1;
        while (k < cols && grid[i][k] === symbol) {
          length++;
          k++;
        }
      } 
      // If vertical
      else if (i + 1 < rows && grid[i + 1][j] === symbol) {
        let k = i + 1;
        while (k < rows && grid[k][j] === symbol) {
          length++;
          k++;
        }
      }

      pieces.set(symbol, new ConcretePiece(symbol, i, j, length, isHorizontal, symbol === "P"));
    }
  }

  console.log(grid);
  return new Board(rows, cols, grid, pieces, exitRow, exitCol);
}
