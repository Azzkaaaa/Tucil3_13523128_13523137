import Footer from "@/components/Footer";
import InputSearch from "@/components/InputSearch";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-rush-primary p-10 flex justify-center items-center mt-14">
        <InputSearch />
      </div>
      <Footer />
    </>
  );
}
