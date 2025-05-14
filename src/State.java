import java.util.*;

public class State {
    private Board board;
    private List<Move> path;
    private int cost;
    private int heuristic;

    // ctor
    public State(Board board, List<Move> path, int cost, int heuristic){
        this.board = board;
        this.path = path;
        this.cost = cost;
        this.heuristic = heuristic;
    }

    // Getter
    public Board getBoard(){
        return board;
    }

    public List<Move> getPath(){
        return path;
    }

    public int getUFC(){
        return cost;
    }

    public int getGreedy(){
        return heuristic;
    }

    public int getA(){
        return cost + heuristic;
    }

    public State copy(){
        return new State(board.copy(), new ArrayList<>(path), cost, heuristic);
    }
}
