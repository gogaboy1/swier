import type { Metadata } from "next";
import "./globals.css";
import "./swipe-overlay.css";

export const metadata: Metadata = {
  title: "Swier - Найди свой стартап",
  description: "Tinder для стартапов и инвесторов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
