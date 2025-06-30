import Navbar from "@/components/navbar/Navbar";
import Footer from "./_components/footer-section/Footer";

export default function HomeLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="min-h-screen bg-gray-200">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}