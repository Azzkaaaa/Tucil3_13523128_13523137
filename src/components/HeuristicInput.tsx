"use client";

import useInputSearchStore from "@/store/InputSearchStore";
import React, { ChangeEvent } from "react";

interface Heuristic {
  value: string;
  label: string;
}

const HeuristicInput = () => {
  const setHeuristic = useInputSearchStore((state) => state.setHeuristic);
  const selectedHeuristic = useInputSearchStore((state) => state.selectedHeuristic);

  // List of heuristics
  const heuristics: Heuristic[] = [
    { value: "1", label: "Heuristic 1" },
    { value: "2", label: "Heuristic 2" },
    { value: "3", label: "Heuristic 3" },
  ];

  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    e.preventDefault();
    const selectedValue = e.target.value;
    setHeuristic(selectedValue);
  };

  return (
    <div className="bg-rush-primary p-5 rounded-2xl min-w-1/3 text-rush-accent-1">
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
