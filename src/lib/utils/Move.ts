"use client";

import { Board } from "../models/Board";
import { Piece } from "../models/Piece";

// Direction
export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

// Move class
export class Move {
  constructor(public pieceId: string, public direction: Direction, public steps: number = 1) {}

  toString(): string {
    return `${this.pieceId}-${this.direction}-${this.steps}`;
  }
}

// Movement Manager
export class MovementManager {
  static isValidMove(board: Board, pieceId: string, direction: Direction, steps: number = 1): boolean {
    const piece = board.getPieces().get(pieceId);
    if (!piece) return false;

    const grid = board.getGrid();
    const rows = board.getRows();
    const cols = board.getCols();
    const exitRow = board.getExitRow();
    const exitCol = board.getExitCol();

    // Check horizontal
    if (piece.isHorizontal) {
      if (direction === Direction.UP || direction === Direction.DOWN) {
        return false;
      }
      // Check left move
      if (direction === Direction.LEFT) {
        if (piece.col < steps) return false;

        for (let i = 1; i <= steps; i++) {
          // TODO: move this to parser (check if board valid -- can be completed)
          if (exitCol === -1 && exitRow === piece.row && piece.isPrimary && piece.col === i) {
            return true;
          }

          if (grid[piece.row][piece.col - i] !== ".") {
            return false;
          }
        }

        return true;
      } else {
        // Check right move
        const rightEdge = piece.col + piece.length;
        if (rightEdge + steps > cols) return false;

        for (let i = 0; i < steps; i++) {
          if (exitCol === cols && exitRow === piece.row && piece.isPrimary && rightEdge + i === cols - 1) {
            return true;
          }

          if (grid[piece.row][rightEdge + i] !== ".") {
            return false;
          }
        }

        return true;
      }
    }
    // Check vertical
    else {
      if (direction === Direction.LEFT || direction === Direction.RIGHT) {
        return false;
      }
      // Check up move
      if (direction === Direction.UP) {
        if (piece.row < steps) return false;

        for (let i = 1; i <= steps; i++) {
          if (exitRow === -1 && exitCol === piece.col && piece.isPrimary && piece.row === i) {
            return true;
          }

          if (grid[piece.row - i][piece.col] !== ".") {
            return false;
          }
        }

        return true;
      } else {
        // Check down move
        const bottomEdge = piece.row + piece.length;
        if (bottomEdge + steps > rows) return false;

        for (let i = 0; i < steps; i++) {
          if (exitRow === rows && exitCol === piece.col && piece.isPrimary && bottomEdge + i === rows - 1) {
            return true;
          }

          if (grid[bottomEdge + i][piece.col] !== ".") {
            return false;
          }
        }

        return true;
      }
    }
  }

  // Apply move
  static applyMove(board: Board, move: Move): Board {
    const newBoard = board.copy();
    const pieces = newBoard.getPieces();
    const piece = pieces.get(move.pieceId);

    // Return original board if not valid
    if (!piece || !this.isValidMove(board, move.pieceId, move.direction, move.steps)) {
      return board;
    }

    const grid = newBoard.getGrid();

    // Remove piece
    this.clearPieceFromGrid(grid, piece);

    // Update piece position
    switch (move.direction) {
      case Direction.UP:
        piece.row -= move.steps;
        break;
      case Direction.DOWN:
        piece.row += move.steps;
        break;
      case Direction.LEFT:
        piece.col -= move.steps;
        break;
      case Direction.RIGHT:
        piece.col += move.steps;
        break;
    }

    // Place piece to new position
    this.placePieceOnGrid(grid, piece);

    return newBoard;
  }

  // All possible moves, including multiple steps (separated)
  static getPossibleMoves(board: Board): Move[] {
    const moves: Move[] = [];
    const pieces = board.getPieces();

    // Loop each piece
    for (const [id] of pieces) {
      // Loop each direction
      for (const direction of Object.values(Direction)) {
        const dir = direction as Direction;
        const maxSteps = this.getMaxSteps(board, id, dir);

        // Loop each possible steps
        for (let steps = 1; steps <= maxSteps; steps++) {
          if (this.isValidMove(board, id, dir, steps)) {
            moves.push(new Move(id, dir, steps));
          }
        }
      }
    }

    return moves;
  }

  // Clear piece from grid
  private static clearPieceFromGrid(grid: string[][], piece: Piece): void {
    if (piece.isHorizontal) {
      for (let c = piece.col; c < piece.col + piece.length; c++) {
        grid[piece.row][c] = ".";
      }
    } else {
      for (let r = piece.row; r < piece.row + piece.length; r++) {
        grid[r][piece.col] = ".";
      }
    }
  }

  // Place piece on grid
  private static placePieceOnGrid(grid: string[][], piece: Piece): void {
    if (piece.isHorizontal) {
      for (let c = piece.col; c < piece.col + piece.length; c++) {
        grid[piece.row][c] = piece.id;
      }
    } else {
      for (let r = piece.row; r < piece.row + piece.length; r++) {
        grid[r][piece.col] = piece.id;
      }
    }
  }

  // Max possibple steps
  static getMaxSteps(board: Board, pieceId: string, direction: Direction): number {
    const piece = board.getPieces().get(pieceId);
    if (!piece) return 0;

    const grid = board.getGrid();
    const rows = board.getRows();
    const cols = board.getCols();
    const exitRow = board.getExitRow();
    const exitCol = board.getExitCol();
    let steps = 0;

    // Horizontal piece
    if (piece.isHorizontal) {
      if (direction === Direction.LEFT) {
        for (let c = piece.col - 1; c >= 0; c--) {
          if (grid[piece.row][c] === ".") {
            steps++;
          } else {
            break;
          }
        }

        // Left exit
        if (piece.isPrimary && exitCol === -1 && exitRow === piece.row && steps >= piece.col) {
          return piece.col;
        }
      } else if (direction === Direction.RIGHT) {
        for (let c = piece.col + piece.length; c < cols; c++) {
          if (grid[piece.row][c] === ".") {
            steps++;
          } else {
            break;
          }
        }

        // Right exit
        if (piece.isPrimary && exitCol === cols && exitRow === piece.row && piece.col + piece.length + steps >= cols) {
          return cols - (piece.col + piece.length); // Can move all the way to the exit
        }
      }
    } else {
      // Vertical piece
      if (direction === Direction.UP) {
        for (let r = piece.row - 1; r >= 0; r--) {
          if (grid[r][piece.col] === ".") {
            steps++;
          } else {
            break;
          }
        }

        // Top exit
        if (piece.isPrimary && exitRow === -1 && exitCol === piece.col && steps >= piece.row) {
          return piece.row;
        }
      } else if (direction === Direction.DOWN) {
        for (let r = piece.row + piece.length; r < rows; r++) {
          if (grid[r][piece.col] === ".") {
            steps++;
          } else {
            break;
          }
        }

        // Bottom exit
        if (piece.isPrimary && exitRow === rows && exitCol === piece.col && piece.row + piece.length + steps >= rows) {
          return rows - (piece.row + piece.length);
        }
      }
    }

    return steps;
  }
}
