import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "@/components/shared/content/footer";
import { useGetCustomer } from "@/hooks";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function HistoryOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, customer } = await useGetCustomer();
  if(!isAuthenticated) {
    return redirect("/");
  }
    return (
      <div className="min-h-screen bg-gray-200">
      <Navbar isAuthenticated={isAuthenticated} customer={customer!} />
      {children}
    </div>
    );
}