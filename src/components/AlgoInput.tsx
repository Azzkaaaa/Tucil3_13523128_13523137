"use client";

import useGameStore from "@/store/GameStore";
import { AlgorithmType } from "@/store/GameStore";
import React, { ChangeEvent } from "react";

interface Algorithm {
  value: string;
  label: string;
}

const AlgoInput = () => {
  const selectedAlgorithm = useGameStore((state) => state.selectedAlgorithm);
  const setAlgorithm = useGameStore((state) => state.setAlgorithm);

  // List of algorithms
  const algorithms: Algorithm[] = [
    { value: AlgorithmType.UCS, label: "Uniform Cost Search" },
    { value: AlgorithmType.GBFS, label: "Greedy Best-First Search" },
    { value: AlgorithmType.ASTAR, label: "A* Search" },
  ];

  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    e.preventDefault();
    const selectedValue = e.target.value as AlgorithmType;
    setAlgorithm(selectedValue);
  };

  return (
    <div className="bg-rush-primary p-5 rounded-2xl w-full text-rush-accent-1">
      <label className="block text-sm font-medium mb-2">Select Algorithm</label>
      <div className="">
        <select
          id="algorithm-select"
          value={selectedAlgorithm}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none">
          {algorithms.map((algo) => (
            <option key={algo.value} value={algo.value}>
              {algo.label}
            </option>
          ))}
        </select>
      </div>
      {selectedAlgorithm && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: {algorithms.find((algo) => algo.value === selectedAlgorithm)?.label}
        </p>
      )}
    </div>
  );
};

export default AlgoInput;
