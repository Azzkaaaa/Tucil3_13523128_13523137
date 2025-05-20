"use client";

import InputSearch from "@/components/InputSearch";
import Navbar from "@/components/Navbar";
import SolutionDisplay from "@/components/Solution";
import useGameStore from "@/store/GameStore";

export default function Home() {
  const board = useGameStore((state) => state.board);
  return (
    <>
      <Navbar />
      <div className="h-full w-full bg-rush-primary p-10 flex justify-center items-center">
        <InputSearch />
      </div>
      <div>
        {board && <SolutionDisplay />}
      </div>
    </>
  );
}
