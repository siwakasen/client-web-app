import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "../../../components/shared/content/footer";
export default function TravelPackageDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
