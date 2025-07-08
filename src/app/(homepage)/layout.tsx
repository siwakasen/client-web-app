"use server";
import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "./_components/footer-section/Footer";
import { getCustomer } from "@/_services/customers";
import { Customer } from "@/_interfaces/customer.interface";
import { getHeaders, getToken, hasSession } from "@/lib";
export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isAuthenticated = await hasSession();
  const header = await getHeaders();

  let customer: Customer;
  try {
    if (isAuthenticated) {
      const token = await getToken();
      const { data } = await getCustomer(token!, header);
      customer = data;
    }
  } catch (error) {
    isAuthenticated = false;
  }
  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar isAuthenticated={isAuthenticated} customer={customer!} />
      {children}
      <Footer />
    </div>
  );
}
