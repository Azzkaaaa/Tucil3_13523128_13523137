"use client";

import useGameStore from "@/store/GameStore";
import { AlgorithmType } from "@/store/GameStore";
import React, { ChangeEvent } from "react";

interface Algorithm {
  value: string;
  label: string;
}

const AlgoInput = () => {
  const { selectedAlgorithm, setAlgorithm, setBeamWidth, beamWidth } = useGameStore();

  // List of algorithms
  const algorithms: Algorithm[] = [
    { value: AlgorithmType.UCS, label: "Uniform Cost Search" },
    { value: AlgorithmType.GBFS, label: "Greedy Best-First Search" },
    { value: AlgorithmType.ASTAR, label: "A* Search" },
    { value: AlgorithmType.BEAM, label: "Beam Search" },
  ];

  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    e.preventDefault();
    const selectedValue = e.target.value as AlgorithmType;
    setAlgorithm(selectedValue);
  };

  const handleBeamWidthChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setBeamWidth(value);
    }
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
      {selectedAlgorithm === AlgorithmType.BEAM && (
        <div className="mt-5">
          <label htmlFor="beam-width" className="block text-sm font-medium mb-2">
            Beam Width
          </label>
          <div className="flex items-center gap-2">
            <input
              id="beam-width"
              type="number"
              min="1"
              max="1000"
              value={beamWidth}
              onChange={handleBeamWidthChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Beam width controls how many nodes to keep at each search level.
          </p>
          <div className="mt-2">
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={beamWidth}
              onChange={handleBeamWidthChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Faster (5)</span>
              <span>More thorough (500)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgoInput;