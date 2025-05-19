import React from "react";
import Loader from "./Loader";
import AlgoInput from "./AlgoInput";
import HeuristicInput from "./HeuristicInput";

const InputSearch = () => {
  return (
    <div className="w-2/3 bg-rush-secondary rounded-2xl p-5 flex flex-col justify-center items-center gap-10">
      <div className="text-3xl font-bold">RushPush Solver</div>
      <div className="w-full p-5 flex justify-center items-center gap-10">
        <Loader />
        <div className="flex flex-col gap-5">
          <AlgoInput />
          <HeuristicInput />
        </div>
      </div>
      <button className="py-2 px-4 bg-rush-accent-2 rounded-3xl text-rush-secondary font-bold hover:cursor-pointer hover:bg-rush-primary/80 hover:text-rush-accent-1">Start RushPush!</button>
    </div>
  );
};

export default InputSearch;
