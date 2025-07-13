import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "../../../components/shared/content/footer";
import { getToken, hasSession } from "@/lib/session";
import { getCustomer } from "@/_services/customers";
import { Customer } from "@/_interfaces";
import { getHeaders } from "@/lib";
export default async function TravelPackageDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isAuthenticated = await hasSession();

  let customer: Customer;
  try {
    if (isAuthenticated) {
      const token = await getToken();
      const header = await getHeaders();
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
