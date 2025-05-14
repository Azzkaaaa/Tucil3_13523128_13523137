public class Move {
    private char pieceId;
    private String moveDirection; 

    // ctor
    public Move(char pieceId, String moveDirection){
        this.pieceId = pieceId;
        this.moveDirection = moveDirection;
    }

    // Getter
    public char getPieceId(){
        return pieceId;
    }

    public String getMoveDirection(){
        return moveDirection;
    }

    @Override
    public String toString(){
        return pieceId + "-" + moveDirection;
    }
}
