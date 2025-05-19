import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="h-screen w-full bg-rush-background p-10">
        <Loader/>
      </div>
    </>
  );
}
