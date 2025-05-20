import { toast } from "sonner";
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
  try {
    const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");

    // At least 3 lines (dimensions, pieceCount, and at least one grid line)
    if (lines.length < 3) {
      toast.error("Invalid file format", { description: "File does not contain enough lines." });
      return null;
    }

    // Check dimension number
    const [A, B] = lines[0].split(" ").map(Number);
    if (isNaN(A) || isNaN(B) || A <= 0 || B <= 0) {
      toast.error("Invalid dimensions", { description: "Board dimensions must be positive numbers." });
      return null;
    }

    const rows = A;
    const cols = B;

    // Check number of pieces
    const N = parseInt(lines[1], 10);
    if (isNaN(N) || N < 0) {
      toast.error("Invalid piece count", { description: "Number of pieces must be a non-negative integer." });
      return null;
    }

    // Check if file has enough lines to contain the complete board configuration
    // Minimum expected: 2 (dimensions, pieceCount) + rows (grid lines)
    // Maximum expected: 2 + rows + 2 (possible K on top and bottom)
    if (lines.length < 2 + rows) {
      toast.error("Invalid file format", {
        description: `The file does not contain enough lines for the board configuration. Expected at least ${2 + rows} lines.`,
      });
      return null;
    }

    if (lines.length > 2 + rows + 2) {
      toast.error("Invalid file format", {
        description: `The file contains too many lines. Expected at most ${2 + rows + 2} lines.`,
      });
      return null;
    }

    // Identify possible K positions in the file
    let hasTopExit = false;
    let hasBottomExit = false;

    // Top Exit
    if (lines[2].includes("K") && !lines[2].includes(".") && !lines[2].match(/[A-Z]/g)?.filter((char) => char !== "K").length) {
      hasTopExit = true;
    }

    // Bottom Exit
    const lastLine = lines[lines.length - 1];
    if (lastLine.includes("K") && !lastLine.includes(".") && !lastLine.match(/[A-Z]/g)?.filter((char) => char !== "K").length) {
        hasBottomExit = true;
    }

    // Grid line start based on exit position
    let gridStartIndex = 2;
    if (hasTopExit) {
      gridStartIndex = 3;
    }

    // Extract grid lines
    const possibleGridEndIndex = gridStartIndex + rows;
    if (possibleGridEndIndex > lines.length) {
      toast.error("Invalid file format", {
        description: "The file does not contain enough lines for the grid.",
      });
      return null;
    }

    const gridLines = lines.slice(gridStartIndex, possibleGridEndIndex);

    // Check grid lines length (cols)
    for (let i = 0; i < gridLines.length; i++) {
      const line = gridLines[i];
      const nonWhitespaceChars = line.replace(/\s/g, "").length;
      if (nonWhitespaceChars < cols) {
        toast.error("Invalid grid line", {
          description: `Line ${i + 1} has insufficient content. Expected at least ${cols} grid cells.`,
        });
        return null;
      }
    }

    let exitRow = -1;
    let exitCol = -1;

    // Top exit
    if (hasTopExit) {
      exitRow = -1;
      exitCol = lines[2].indexOf("K");
      if (exitCol < 0 || exitCol >= cols) {
        toast.error("Invalid exit position", {
          description: "Top exit (K) must be within the column range of the grid.",
        });
        return null;
      }
    }

    // Bottom exit
    if (hasBottomExit) {
      exitRow = rows;
      exitCol = lines[lines.length - 1].indexOf("K");
      if (exitCol < 0 || exitCol >= cols) {
        toast.error("Invalid exit position", {
          description: "Bottom exit (K) must be within the column range of the grid.",
        });
        return null;
      }
    }

    // Left or right exit
    if (exitRow === -1 && exitCol === -1) {
      for (let i = 0; i < gridLines.length; i++) {
        const line = gridLines[i];

        // Left exit
        if (line[0] === "K") {
          exitRow = i;
          exitCol = -1;
          break;
        }

        // Right exit
        const nonWhitespaceChars = line.replace(/\s/g, "");
        if (nonWhitespaceChars.length > cols && nonWhitespaceChars[cols] === "K") {
          exitRow = i;
          exitCol = cols;
          break;
        }
      }
    }

    // Validate exit
    if (exitRow === -1 && exitCol === -1) {
      toast.error("No exit found", {
        description: "The board must have an exit marked with 'K' at one of the edges.",
      });
      return null;
    }

    const grid: string[][] = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill("."));

    for (let i = 0; i < rows; i++) {
      const line = gridLines[i];
      const nonWhitespaceLine = line.replace(/\s/g, "");

      const startIndex = exitCol === -1 && exitRow === i ? 1 : 0;

      let gridColIndex = 0;
      for (let j = startIndex; j < nonWhitespaceLine.length && gridColIndex < cols; j++) {
        if (exitCol === cols && exitRow === i && j === cols) {
          continue;
        }

        const char = nonWhitespaceLine[j];

        if (char === "." || char.match(/[A-Z0-9]/i)) {
          grid[i][gridColIndex] = char;
          gridColIndex++;
        }
      }
    }

    // Check K not inside grid
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] === "K") {
          toast.error("Invalid exit position", {
            description: "The exit 'K' cannot be inside the grid. It must be placed on the border.",
          });
          return null;
        }
      }
    }

    // Find connected components
    const pieces = new Map<string, Piece>();
    const symbolComponents = new Map<string, Array<Array<{ row: number; col: number }>>>();

    // Collect all unique symbols
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const symbol = grid[i][j];
        if (symbol === ".") continue;

        if (!symbolComponents.has(symbol)) {
          symbolComponents.set(symbol, []);
        }
      }
    }

    // Helper to find connected components
    const visited = new Set<string>();

    function findConnected(row: number, col: number, symbol: string, component: Array<{ row: number; col: number }>) {
      const key = `${row},${col}`;
      if (row < 0 || row >= rows || col < 0 || col >= cols || visited.has(key) || grid[row][col] !== symbol) {
        return;
      }

      visited.add(key);
      component.push({ row, col });

      findConnected(row + 1, col, symbol, component);
      findConnected(row - 1, col, symbol, component);
      findConnected(row, col + 1, symbol, component);
      findConnected(row, col - 1, symbol, component);
    }

    // Find all connected components
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const symbol = grid[i][j];
        if (symbol === "." || visited.has(`${i},${j}`)) continue;

        const component: Array<{ row: number; col: number }> = [];
        findConnected(i, j, symbol, component);

        if (component.length > 0) {
          symbolComponents.get(symbol)?.push(component);
        }
      }
    }

    // Check primary piece
    if (!symbolComponents.has("P")) {
      toast.error("No primary piece found", {
        description: "The board must contain exactly one primary piece marked with 'P'.",
      });
      return null;
    }

    const primaryPieceComponents = symbolComponents.get("P") || [];
    if (primaryPieceComponents.length === 0) {
      toast.error("No primary piece found", {
        description: "The board must contain exactly one primary piece marked with 'P'.",
      });
      return null;
    }

    if (primaryPieceComponents.length > 1) {
      toast.error("Multiple primary pieces", {
        description: `Found ${primaryPieceComponents.length} separate primary pieces. The board must contain exactly one connected primary piece.`,
      });
      return null;
    }

    // Check if any symbol has multiple disconnected components
    for (const [symbol, components] of symbolComponents.entries()) {
      if (components.length > 1) {
        toast.error("Disconnected piece", {
          description: `Piece '${symbol}' appears in ${components.length} separate locations. Each piece must be connected.`,
        });
        return null;
      }
    }

    // Check number of non-primary pieces
    const nonPrimaryPieceCount = symbolComponents.size - (symbolComponents.has("P") ? 1 : 0);
    if (N !== nonPrimaryPieceCount) {
      toast.error("Piece count mismatch", {
        description: `The file specifies ${N} non-primary pieces but ${nonPrimaryPieceCount} were found in the grid.`,
      });
      return null;
    }

    // Create piece objects and check orientation
    for (const [symbol, components] of symbolComponents.entries()) {
      if (components.length === 0) continue;

      const cells = components[0];

      const rowIndices = new Set<number>();
      const colIndices = new Set<number>();

      for (const { row, col } of cells) {
        rowIndices.add(row);
        colIndices.add(col);
      }

      // Find the top-left corner
      cells.sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
      });

      const topLeft = cells[0];

      // Check orientation
      const isHorizontal = rowIndices.size === 1;
      const isVertical = colIndices.size === 1;

      // (horizontal xor vertical)
      if (!isHorizontal && !isVertical) {
        toast.error("Invalid piece shape", {
          description: `Piece '${symbol}' is not a straight line. Pieces must be either horizontal or vertical.`,
        });
        return null;
      }

      // Check continuity
      if (isHorizontal) {
        const sortedCols = Array.from(colIndices).sort((a, b) => a - b);
        for (let i = 1; i < sortedCols.length; i++) {
          if (sortedCols[i] !== sortedCols[i - 1] + 1) {
            toast.error("Discontinuous piece", {
              description: `Horizontal piece '${symbol}' has gaps between its cells.`,
            });
            return null;
          }
        }
      } else {
        const sortedRows = Array.from(rowIndices).sort((a, b) => a - b);
        for (let i = 1; i < sortedRows.length; i++) {
          if (sortedRows[i] !== sortedRows[i - 1] + 1) {
            toast.error("Discontinuous piece", {
              description: `Vertical piece '${symbol}' has gaps between its cells.`,
            });
            return null;
          }
        }
      }

      // Create piece
      pieces.set(symbol, new ConcretePiece(symbol, topLeft.row, topLeft.col, cells.length, isHorizontal, symbol === "P"));
    }

    const primaryPiece = pieces.get("P");
    if (!primaryPiece) {
      toast.error("No primary piece found", {
        description: "The board must contain exactly one primary piece marked with 'P'.",
      });
      return null;
    }

    // Check alignment
    // Horizontal primary piece
    if (primaryPiece.isHorizontal) {
      //  Left/right exit
      if (exitCol !== -1 && exitCol !== cols) {
        toast.error("Exit not aligned with primary piece", {
          description: "For a horizontal primary piece, the exit must be on the left or right side of the board.",
        });
        return null;
      }

      if ((exitCol === -1 || exitCol === cols) && exitRow !== primaryPiece.row) {
        toast.error("Exit not aligned with primary piece", {
          description: "For a horizontal primary piece, the exit must be on the same row.",
        });
        return null;
      }
    } else {
      // Vertical primary piece
      // Top/bottom exit
      if (exitRow !== -1 && exitRow !== rows) {
        toast.error("Exit not aligned with primary piece", {
          description: "For a vertical primary piece, the exit must be on the top or bottom side of the board.",
        });
        return null;
      }

      if ((exitRow === -1 || exitRow === rows) && exitCol !== primaryPiece.col) {
        toast.error("Exit not aligned with primary piece", {
          description: "For a vertical primary piece, the exit must be on the same column.",
        });
        return null;
      }
    }

    // All passed
    toast.success("Board loaded successfully", {
      description: `${rows}x${cols} board with ${pieces.size} pieces and valid exit configuration.`,
    });

    return new Board(rows, cols, grid, pieces, exitRow, exitCol);
  } catch (error) {
    console.error("Error parsing board:", error);
    toast.error("Failed to parse board", {
      description: "An unexpected error occurred while parsing the board configuration.",
    });
    return null;
  }
}
