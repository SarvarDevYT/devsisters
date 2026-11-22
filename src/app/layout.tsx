import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0d071d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "devsisters.uz — Raqamli avlod qizlar uchun ta'lim platformasi",
  description: "Qizlarga qulay, zamonaviy va bepul bilim olish muhitini yaratuvchi milliy ta'lim platformasi. 7 ta fan, 7 ta tajribali o'qituvchi, video darslar, interaktiv testlar va hamjamiyat.",
  keywords: ["devsisters", "devsisters.uz", "qizlar ta'limi", "bepul ta'lim", "ingliz tili", "arab tili", "kimyo", "ona tili", "geografiya", "rus tili", "sport"],
  openGraph: {
    title: "devsisters.uz — Raqamli avlod qizlar uchun ta'lim platformasi",
    description: "Qizlarga qulay, zamonaviy va bepul bilim olish muhiti.",
    url: "https://devsisters.uz",
    siteName: "devsisters.uz",
    locale: "uz_UZ",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen w-full overflow-x-hidden relative bg-[#0d071d] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-pink-500 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
