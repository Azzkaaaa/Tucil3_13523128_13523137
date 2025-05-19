import InputSearch from "@/components/InputSearch";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="h-full w-full bg-rush-primary p-10 flex justify-center items-center">
        <InputSearch />
      </div>
    </>
  );
}
