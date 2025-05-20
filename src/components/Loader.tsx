"use client";

import { parseBoardFromString } from "@/lib/utils/Parser";
import useGameStore from "@/store/GameStore";
import React from "react";

const Loader = () => {
  const setBoard = useGameStore((state) => state.setBoard);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const board = parseBoardFromString(text);
        if (board) {
          setBoard(board);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a .txt file");
    }
  };

  return (
    <div className="p-6 h-full w-2/5 rounded-2xl shadow-md bg-rush-primary text-rush-secondary">
      <h2 className="text-2xl font-semibold mb-4">Insert Game Configuration {`(.txt)`}</h2>

      <label className="block mb-4">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="block w-full text-sm text-rush-secondary
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-rush-accent-2 file:text-rush-secondary
                     hover:file:bg-rush-accent-2/90 file:hover:cursor-pointer"
        />
      </label>
    </div>
  );
};

export default Loader;
