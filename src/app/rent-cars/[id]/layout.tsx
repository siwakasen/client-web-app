import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "@/components/shared/content/footer";
import { useGetCustomer } from "@/hooks";
export default async function RentCarDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, customer } = await useGetCustomer();
  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar isAuthenticated={isAuthenticated} customer={customer!} />
      {children}
      <Footer />
    </div>
  );
}
