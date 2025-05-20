"use client";

import { Board } from "../models/Board";
import { HeuristicType } from "@/store/GameStore";

export class Heuristics {
  static calculateHeuristic(board: Board, heuristicType: HeuristicType): number {
    switch (heuristicType) {
      case HeuristicType.MANHATTAN:
        return this.manhattanDistanceHeuristic(board);
      case HeuristicType.BLOCKING:
        return this.blockingPiecesHeuristic(board);
      case HeuristicType.DISTANCE:
        return this.distanceToExitHeuristic(board);
      default:
        return this.manhattanDistanceHeuristic(board);
    }
  }

  // Manhattan distance heuristic
  static manhattanDistanceHeuristic(board: Board): number {
    let primaryPiece = null;
    for (const piece of board.getPieces().values()) {
      if (piece.isPrimary) {
        primaryPiece = piece;
        break;
      }
    }

    if (!primaryPiece) return 0;

    const exitRow = board.getExitRow();
    const exitCol = board.getExitCol();

    let distance = 0;

    // Horizontal
    if (primaryPiece.isHorizontal) {
      // Right exit
      if (exitCol === board.getCols()) {
        const rightEdgeOfPiece = primaryPiece.col + primaryPiece.length - 1;
        const rightEdgeOfBoard = board.getCols() - 1;
        distance = rightEdgeOfBoard - rightEdgeOfPiece;
      }
      // Left exit
      else if (exitCol === -1) {
        distance = primaryPiece.col;
      }
    }
    // Vertical
    else {
      // Bottom exit
      if (exitRow === board.getRows()) {
        const bottomEdgeOfPiece = primaryPiece.row + primaryPiece.length - 1;
        const bottomEdgeOfBoard = board.getRows() - 1;
        distance = bottomEdgeOfBoard - bottomEdgeOfPiece;
      }
      // Top exit
      else if (exitRow === -1) {
        distance = primaryPiece.row;
      }
    }

    return distance;
  }

  // Blocking pieces heuristic
  static blockingPiecesHeuristic(board: Board): number {
    let primaryPiece = null;
    for (const piece of board.getPieces().values()) {
      if (piece.isPrimary) {
        primaryPiece = piece;
        break;
      }
    }

    if (!primaryPiece) return 0;

    const grid = board.getGrid();
    const exitRow = board.getExitRow();
    const exitCol = board.getExitCol();

    let blockingPieces = 0;

    // Horizontal
    if (primaryPiece.isHorizontal) {
      // Right exit
      if (exitCol === board.getCols() && primaryPiece.row === exitRow) {
        const rightEdge = primaryPiece.col + primaryPiece.length;
        const blockedCells = new Set<string>();
        
        // Each cell from piece to exit
        for (let c = rightEdge; c < board.getCols(); c++) {
          const cellValue = grid[primaryPiece.row][c];
          if (cellValue !== "." && cellValue !== "P") {
            blockedCells.add(cellValue);
          }
        }
        
        blockingPieces = blockedCells.size;
      }
      // Left exit
      else if (exitCol === -1 && primaryPiece.row === exitRow) {
        const blockedCells = new Set<string>();
        
        // Each cell from piece to exit
        for (let c = primaryPiece.col - 1; c >= 0; c--) {
          const cellValue = grid[primaryPiece.row][c];
          if (cellValue !== "." && cellValue !== "P") {
            blockedCells.add(cellValue);
          }
        }
        
        blockingPieces = blockedCells.size;
      }
    }
    // Vertical
    else {
      // Bottom exit
      if (exitRow === board.getRows() && primaryPiece.col === exitCol) {
        const bottomEdge = primaryPiece.row + primaryPiece.length;
        const blockedCells = new Set<string>();
        
        // Each cell from piece to exit
        for (let r = bottomEdge; r < board.getRows(); r++) {
          const cellValue = grid[r][primaryPiece.col];
          if (cellValue !== "." && cellValue !== "P") {
            blockedCells.add(cellValue);
          }
        }
        
        blockingPieces = blockedCells.size;
      }
      // Top exit
      else if (exitRow === -1 && primaryPiece.col === exitCol) {
        const blockedCells = new Set<string>();
        
        // Each cell from piece to exit
        for (let r = primaryPiece.row - 1; r >= 0; r--) {
          const cellValue = grid[r][primaryPiece.col];
          if (cellValue !== "." && cellValue !== "P") {
            blockedCells.add(cellValue);
          }
        }
        
        blockingPieces = blockedCells.size;
      }
    }

    return blockingPieces * 2; // Each blocking piece counts double
  }

  // Distance to exit heuristic - combines manhattan and blocking
  static distanceToExitHeuristic(board: Board): number {
    const distance = this.manhattanDistanceHeuristic(board);
    const blocking = this.blockingPiecesHeuristic(board);
    
    return distance + blocking * 0.5; // More conservative for A*
  }
  
  // Distance to exit heuristic for GBFS
  static gbfsDistanceToExitHeuristic(board: Board): number {
    const distance = this.manhattanDistanceHeuristic(board);
    const blocking = this.blockingPiecesHeuristic(board);
    
    return distance + blocking;
  }
}