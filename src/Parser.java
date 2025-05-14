import java.io.*;
import java.util.*;

public class Parser {
    public static Board parseBoard(String filename) throws IOException{
        BufferedReader reader = new BufferedReader(new FileReader(filename));

        String[] dim = reader.readLine().split(" ");
        int rows = Integer.parseInt(dim[0]);
        int cols = Integer.parseInt(dim[1]);

        reader.readLine();
        List<String> lines = new ArrayList<>();
        for (int i = 0; i < rows; i++) {
            lines.add(reader.readLine());
        }

        char[][] grid = new char[rows][];
        Map<Character, Piece> pieces = new HashMap<>();
        int exitRow = -1;
        int exitCol = -1;

        for (int i = 0; i < rows; i++) {
            String line = lines.get(i);
            grid[i] = line.toCharArray();
        }

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < grid[i].length; j++) {
                char symbol = grid[i][j];

                if (symbol == 'K') {
                    exitRow = i;
                    exitCol = j;
                }

                if (symbol == '.' || symbol == 'K') continue;

                if (!pieces.containsKey(symbol)) {
                    int length = 1;
                    boolean isHorizontal = false;

                    if (j + 1 < grid[i].length && grid[i][j + 1] == symbol) {
                        isHorizontal = true;
                        int k = j + 1;
                        while (k < grid[i].length && grid[i][k] == symbol) {
                            length++;
                            k++;
                        }
                    } else if (i + 1 < rows && grid[i + 1] != null && j < grid[i + 1].length && grid[i + 1][j] == symbol) {
                        isHorizontal = false;
                        int k = i + 1;
                        while (k < rows && grid[k] != null && j < grid[k].length && grid[k][j] == symbol) {
                            length++;
                            k++;
                        }
                    }

                    boolean isPrimary = (symbol == 'P');
                    pieces.put(symbol, new Piece(symbol, j, i, length, isHorizontal, isPrimary));
                }
            }
        }

        String line;
        int extraRow = rows;

        while ((line = reader.readLine()) != null) {
            for (int j = 0; j < line.length(); j++) {
                if (line.charAt(j) == 'K') {
                    exitRow = extraRow;
                    exitCol = j;
                }
            }
            extraRow++;
        }


        reader.close();
        return new Board(rows, cols, grid, pieces, exitRow, exitCol);
    }
}
