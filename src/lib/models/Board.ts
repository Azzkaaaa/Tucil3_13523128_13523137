import { Piece } from "./Piece";

export class Board {
    constructor(
        private rows: number,
        private cols: number,
        private grid: string[][],
        private pieces: Map<string, Piece>,
        private exitRow: number,
        private exitCol: number
    ) {}

    getRows(): number {
        return this.rows;
    }

    getCols(): number {
        return this.cols;
    }

    getGrid(): string[][] {
        return this.grid;
    }

    getPieces(): Map<string, Piece> {
        return this.pieces;
    }

    getExitRow(): number {
        return this.exitRow;
    }

    getExitCol(): number {
        return this.exitCol;
    }

    isGoal(): boolean {
        let primary: Piece | undefined;
        for (const piece of this.pieces.values()) {
            if (piece.isPrimary) {
                primary = piece;
                break;
            }
        }

        if (!primary) return false;

        // Horizontal
        if (primary.isHorizontal) {
            // Right exit
            if (this.exitCol === this.cols) {
                return primary.row === this.exitRow && 
                       primary.col + primary.length - 1 === this.cols - 1;
            }
            // Left exit
            else if (this.exitCol === -1) {
                return primary.row === this.exitRow && primary.col === 0;
            }
        } 
        else {
            // Vertical
            // Bottom exit
            if (this.exitRow === this.rows) {
                return primary.col === this.exitCol && 
                       primary.row + primary.length - 1 === this.rows - 1;
            }
            // Top exit
            else if (this.exitRow === -1) {
                return primary.col === this.exitCol && primary.row === 0;
            }
        }
                
        return false;
    }

    copy(): Board {
        const newGrid = this.grid.map(row => [...row]);
        const newPieces = new Map<string, Piece>();
        for (const [key, piece] of this.pieces.entries()) {
            newPieces.set(key, piece.copy());
        }

        return new Board(this.rows, this.cols, newGrid, newPieces, this.exitRow, this.exitCol);
    }

    printBoard(): string {
        const output: string[] = [];
    
        // Top exit
        if (this.exitRow === -1) {
            const topLine = ' '.repeat(this.exitCol) + 'K';
            output.push(topLine);
        }
    
        // Grid rows
        for (let i = 0; i < this.rows; i++) {
            let line = "";
            if (this.exitCol === -1 && this.exitRow !== i) {
                line = " ";
            }
    
            // Left exit
            if (this.exitRow === i && this.exitCol === -1) {
                line += 'K';
            }
    
            for (let j = 0; j < this.cols; j++) {
                line += this.grid[i][j];
            }
    
            // Right exit
            if (this.exitRow === i && this.exitCol === this.cols) {
                line += 'K';
            }
    
            output.push(line);
        }
    
        // Bottom exit
        if (this.exitRow === this.rows) {
            const bottomLine = ' '.repeat(this.exitCol) + 'K';
            output.push(bottomLine);
        }
    
        return output.join('\n');
    }
}
