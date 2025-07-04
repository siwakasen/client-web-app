import Navbar from "@/components/shared/navbar/Navbar";

export default function RentCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
