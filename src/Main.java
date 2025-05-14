import java.io.*;


public class Main {
    public static void main(String[] args) {
        try {
            Board board = Parser.parseBoard("test/test1.txt");
            board.printBoard();
        } catch (IOException e) {
            System.out.println("File tidak ditemukan: " + e.getMessage());
        }
    }
}
