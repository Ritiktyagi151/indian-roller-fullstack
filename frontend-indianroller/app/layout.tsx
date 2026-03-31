import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
  },
  verification: {
    google: "ggnFD7E2UqE3vdcCkZ0orDxstbcMLLtQ9oAGlQxqJok",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T2TXNH2DR7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T2TXNH2DR7');
          `}
        </Script>
        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization"],
              "@id": "https://www.indianroller.com/#organization",
              "name": "Indian Roller Industries Pvt. Ltd.",
              "url": "https://www.indianroller.com/",
              "logo": "https://www.indianroller.com/assets/images/logo/logo.png",
              "image": "https://www.indianroller.com/admin/fileupload/1%20(10).png",
              "description": "Indian Roller Industries Pvt. Ltd. is an ISO 9001 certified manufacturer of industrial rubber rollers, polyurethane rollers, and customized rollers for steel, textile, paper, packaging, food, and plywood industries.",
              "foundingDate": "1990",
              "email": "info@indianroller.com",
              "telephone": "+91-9811885000",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Plot No. 62/2/1",
                "addressLocality": "Sahibabad",
                "addressRegion": "Uttar Pradesh",
                "addressCountry": "IN",
                "postalCode": "201010"
              },
              "brand": { "@type": "Brand", "name": "Indian Roller" },
              "sameAs": [
                "https://www.facebook.com/indianrollerspvtltd",
                "https://www.youtube.com/channel/UC45R-UyW2EaimlwLGIVWl-Q",
                "https://www.linkedin.com/company/indian-roller-pvt-ltd/"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9811885000",
                "contactType": "Customer Support",
                "areaServed": "Worldwide",
                "availableLanguage": ["English", "Hindi"]
              }
            })
          }}
        />

        {/* LocalBusiness Schema */}
        <Script
          id="localbusiness-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LocalBusiness"],
              "@id": "https://www.indianroller.com/#localbusiness",
              "name": "Indian Roller Industries Pvt. Ltd.",
              "url": "https://www.indianroller.com/",
              "logo": "https://www.indianroller.com/assets/images/logo/logo.png",
              "image": "https://www.indianroller.com/admin/fileupload/1%20(10).png",
              "description": "Indian Roller Industries Pvt. Ltd. is a leading manufacturer of industrial rubber rollers, polyurethane rollers, and customized rollers serving steel, textile, paper, packaging, food, and plywood industries worldwide.",
              "telephone": "+91-9811885000",
              "email": "info@indianroller.com",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Plot No. 62/2/1",
                "addressLocality": "Sahibabad",
                "addressRegion": "Uttar Pradesh",
                "postalCode": "201010",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 28.6731,
                "longitude": 77.3700
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                "opens": "09:00",
                "closes": "18:00"
              },
              "areaServed": { "@type": "AdministrativeArea", "name": "Worldwide" },
              "sameAs": [
                "https://www.facebook.com/indianrollerspvtltd",
                "https://www.linkedin.com/company/indian-roller-pvt-ltd/",
                "https://www.youtube.com/channel/UC45R-UyW2EaimlwLGIVWl-Q"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased bg-[#0a0a0b]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}


