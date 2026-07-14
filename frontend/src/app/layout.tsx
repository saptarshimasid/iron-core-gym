import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["800", "900"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#131313",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Iron Core Performance | Elite High-Performance Gym & Training Lab",
  description: "Forging elite physical development in NY's Industrial District. Join Iron Core Performance for state-of-the-art strength conditioning, recovery programs, and world-class coaching. No contracts, just commitment.",
  keywords: ["gym", "fitness", "strength training", "conditioning", "elite coaching", "powerlifting", "cold plunge", "sauna", "New York gym", "Industrial District"],
  authors: [{ name: "Iron Core Performance" }],
  metadataBase: new URL("https://ironcoreperformance.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Iron Core Performance | Elite High-Performance Gym",
    description: "Forging elite physical development in NY's Industrial District. Join Iron Core Performance for state-of-the-art strength conditioning, recovery programs, and world-class coaching.",
    url: "https://ironcoreperformance.com",
    siteName: "Iron Core Performance",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm-4KixCNbYaYojNbQnOMKS2tH2Y-PtWYBKaXO4UnfPflOigVhy67pn2ipwVsbNAXNdt-UnSO-cCtHrKfXG22Ln4n6DiiUSJj1mvpqRKHunfOnYZgZJXL6zNqhbnsbiBmmp-HE8K2lR1YVm81zogjerSL2O3RPmi4aPsSZIl0WGOMTbw1KoxeCyxkZHubzDaXtTM8v14JDwHVziNOLiO9AY8UkzCUMk5c3kC8Ag27cIQ8PSmI9qGIzA0XREV5y_t6HEQK8bu0q-pM",
        width: 1200,
        height: 630,
        alt: "Iron Core Performance Racks",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iron Core Performance | Elite High-Performance Gym",
    description: "Forging elite physical development in NY's Industrial District. Join Iron Core Performance for state-of-the-art strength conditioning, recovery programs, and world-class coaching.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCm-4KixCNbYaYojNbQnOMKS2tH2Y-PtWYBKaXO4UnfPflOigVhy67pn2ipwVsbNAXNdt-UnSO-cCtHrKfXG22Ln4n6DiiUSJj1mvpqRKHunfOnYZgZJXL6zNqhbnsbiBmmp-HE8K2lR1YVm81zogjerSL2O3RPmi4aPsSZIl0WGOMTbw1KoxeCyxkZHubzDaXtTM8v14JDwHVziNOLiO9AY8UkzCUMk5c3kC8Ag27cIQ8PSmI9qGIzA0XREV5y_t6HEQK8bu0q-pM"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    "name": "Iron Core Performance",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCm-4KixCNbYaYojNbQnOMKS2tH2Y-PtWYBKaXO4UnfPflOigVhy67pn2ipwVsbNAXNdt-UnSO-cCtHrKfXG22Ln4n6DiiUSJj1mvpqRKHunfOnYZgZJXL6zNqhbnsbiBmmp-HE8K2lR1YVm81zogjerSL2O3RPmi4aPsSZIl0WGOMTbw1KoxeCyxkZHubzDaXtTM8v14JDwHVziNOLiO9AY8UkzCUMk5c3kC8Ag27cIQ8PSmI9qGIzA0XREV5y_t6HEQK8bu0q-pM",
    "@id": "https://ironcoreperformance.com",
    "url": "https://ironcoreperformance.com",
    "telephone": "(555) 987-CORE",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Performance Way, Industrial District",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.758896,
      "longitude": -73.985130
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.facebook.com/ironcoreperformance",
      "https://www.instagram.com/ironcoreperformance",
      "https://twitter.com/ironcoreperf"
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} dark scroll-smooth`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=block" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-on-surface font-body-lg selection:bg-primary-fixed selection:text-on-primary-fixed antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
