import java.util.*;

public class Board {
    private int rows, cols;
    private char[][] grid;
    private Map<Character, Piece> pieces;
    private int exitRow, exitCol; // Posisi exit

    // ctor
    public Board(int rows, int cols, char[][] grid, Map<Character, Piece> pieces, int exitRow, int exitCol){
        this.rows = rows;
        this.cols = cols;
        this.grid = grid;
        this.pieces = pieces;
        this.exitRow = exitRow;
        this.exitCol = exitCol;
    }

    // Getter
    public int getRows(){
        return rows;
    }

    public int getCols(){
        return cols;
    }

    public char[][] getGrid(){
        return grid;
    }

    public Map<Character, Piece> getPieces(){
        return pieces;
    }

    public int getExitRow(){
        return exitRow;
    }

    public int getExitCol(){
        return exitCol;
    }

    public boolean isGoal(){
        Piece primary = null;

        for (Piece p : pieces.values()){
            if (p.isPrimary()){
                primary = p;
                break;
            }
        }

        if (primary == null){
            return false;
        }

        if (primary.isHorizontal()){
            return primary.getCol() + primary.getLength() - 1 == exitCol && primary.getRow() == exitRow;
        }else{
            return primary.getRow() + primary.getLength() - 1 == exitRow && primary.getCol() == exitCol;
        }
    }

    public Board copy(){
        char[][] newGrid = new char[rows][cols];

        for (int i = 0; i < rows; i++){
            newGrid[i] = Arrays.copyOf(grid[i], cols);
        }

        Map<Character, Piece> newPieces = new HashMap<>();

        for (Map.Entry<Character, Piece> entry : pieces.entrySet()){
            newPieces.put(entry.getKey(), entry.getValue().copy());
        }

        return new Board(rows, cols, newGrid, newPieces, exitRow, exitCol);
    }
}
