"use server";
import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "./_components/footer-section/Footer";
import { useGetCustomer } from "@/hooks/auth.hook";
export default async function HomeLayout({
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
