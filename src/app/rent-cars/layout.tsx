import Navbar from "@/components/navbar/Navbar";

export default function RentCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <Navbar/>   
      {children}
    </div>
  );
}