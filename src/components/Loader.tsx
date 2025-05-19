"use client";

import { Board } from "@/lib/models/Board";
import { parseBoardFromString } from "@/lib/utils/Parser";
import React, {useState } from "react";

const Loader = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [board, setBoard] = useState<Board | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const boardFromText = parseBoardFromString(text);
        boardFromText?.printBoard();
        setBoard(boardFromText);
        if (boardFromText) {
            setFileContent(boardFromText.printBoard());
        }
    };
      reader.readAsText(file);
    } else {
      alert("Please upload a .txt file");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto rounded-2xl shadow-md bg-rush-primary text-white">
      <h2 className="text-2xl font-semibold mb-4">Insert Game Configuration {`(.txt)`}</h2>

      <label className="block mb-4">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-200
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-white file:text-rush-primary
                     hover:file:bg-gray-100 file:hover:cursor-pointer"
        />
      </label>

      {fileContent ? (
        <pre className="whitespace-pre-wrap bg-white text-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto border border-gray-300">
          {fileContent}
        </pre>
      ) : (
        <p className="text-gray-200 italic">No file loaded.</p>
      )}
    </div>
  );
};

export default Loader;
