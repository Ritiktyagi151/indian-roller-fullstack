import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactWidget from "@/components/ContactWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning yahan zaroori hai taaki browser extensions error na dein
    <div 
      className="font-sans antialiased bg-white text-black"
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
