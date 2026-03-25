import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactWidget from "@/components/ContactWidget";

const geistSans = Geist({ 
  subsets: ["latin"],
  display: 'swap', // Font loading behaviour improve karne ke liye
});

// Global SEO Metadata
export const metadata: Metadata = {
  title: "Indian Roller | High-Quality Industrial Solutions",
  description: "Indian Roller offers premium industrial services and MERN stack development solutions. Leading provider in India.",
  keywords: ["Indian Roller", "Industrial Solutions", "Web Development", "MERN Stack"],
  openGraph: {
    title: "Indian Roller",
    description: "Expert industrial and digital solutions.",
    url: "https://indianroller.com",
    siteName: "Indian Roller",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning yahan zaroori hai taaki browser extensions error na dein
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.className} antialiased bg-white text-black`}
        suppressHydrationWarning
      >
        <Navbar />
        
        {/* Pages ka main content */}
        <main>{children}</main>

        {/* WhatsApp/Call Floating Buttons - Inhe Footer ke upar rakha hai */}
        <ContactWidget />

        <Footer/>
      </body>
    </html>
  );
}