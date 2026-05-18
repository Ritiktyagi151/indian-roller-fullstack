import { Geist } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactWidget from "@/components/ContactWidget";

const geistSans = Geist({ 
  subsets: ["latin"],
  display: 'swap', // Font loading behaviour improve karne ke liye
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning yahan zaroori hai taaki browser extensions error na dein
    <div 
      className={`${geistSans.className} antialiased bg-white text-black`}
      suppressHydrationWarning
    >
      <Navbar />
      
      {/* Pages ka main content */}
      <main>{children}</main>

      {/* WhatsApp/Call Floating Buttons - Inhe Footer ke upar rakha hai */}
      <ContactWidget />

      <Footer/>
    </div>
  );
}
