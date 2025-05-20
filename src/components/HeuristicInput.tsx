"use client";

import useGameStore from "@/store/GameStore";
import { HeuristicType } from "@/store/GameStore";
import React, { ChangeEvent } from "react";

interface Heuristic {
  value: string;
  label: string;
}

const HeuristicInput = () => {
  const setHeuristic = useGameStore((state) => state.setHeuristic);
  const selectedHeuristic = useGameStore((state) => state.selectedHeuristic);

  // List of heuristics
  const heuristics: Heuristic[] = [
    { value: HeuristicType.MANHATTAN, label: "Manhattan Distance" },
    { value: HeuristicType.BLOCKING, label: "Blocking Pieces" },
    { value: HeuristicType.DISTANCE, label: "Distance to Exit" },
  ];

  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    e.preventDefault();
    const selectedValue = e.target.value as HeuristicType;
    setHeuristic(selectedValue);
  };

  return (
    <div className="bg-rush-primary p-5 rounded-2xl w-full text-rush-accent-1">
      <label className="block text-sm font-medium mb-2">Select Heuristic</label>
      <div className="">
        <select
          id="heuristic-select"
          value={selectedHeuristic}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none">
          {heuristics.map((algo) => (
            <option key={algo.value} value={algo.value}>
              {algo.label}
            </option>
          ))}
        </select>
      </div>
      {selectedHeuristic && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: {heuristics.find((algo) => algo.value === selectedHeuristic)?.label}
        </p>
      )}
    </div>
  );
};

export default HeuristicInput;
