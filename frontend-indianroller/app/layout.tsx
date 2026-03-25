import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  // title: "Indian Roller",
  // description: "Your website description",
  icons: {
    icon: "/logo.png", // yahan tera logo wala favicon aayega
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#0a0a0b]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}