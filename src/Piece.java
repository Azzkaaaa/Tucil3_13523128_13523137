public class Piece{
    private char id;
    private int col, row;
    private int length;
    private boolean isHorizontal;
    private boolean isPrimary;

    // ctor
    public Piece(char id, int col, int row, int length, boolean isHorizontal, boolean isPrimary){
        this.id = id;
        this.col = col;
        this.row = row;
        this.length = length;
        this.isHorizontal = isHorizontal;
        this.isPrimary = isPrimary;
    }

    // Getter
    public char getId(){
        return id;
    }

    public int getCol(){
        return col;
    }

    public int getRow(){
        return row;
    }

    public int getLength(){
        return length;
    }

    public boolean isHorizontal(){
        return isHorizontal;
    }

    public boolean  isPrimary(){
        return isPrimary;
    }

    // Deep Copy
    public Piece copy(){
        return new Piece(id, col, row, length, isHorizontal, isPrimary);
    }
}