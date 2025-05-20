import React from "react";

const Navbar = () => {
  return (
    <div className="w-full bg-rush-secondary flex justify-between items-center p-4">
      <div className="text-2xl font-bold w-1/2"><a href="">RushPush</a></div>
      <div className="flex justify-between gap-10 pr-5">
        <a href="">Trakteer</a>
        <a href="">About Us</a>
      </div>
    </div>
  );
};

export default Navbar;
