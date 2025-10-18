// In app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CategoryNav from "@/components/CategoryNav"; // Import new component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AffiliateAvenue",
  description: "Your one-stop shop for the best affiliate deals!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800`}
      >
        <Header />
        <CategoryNav /> {/* Add the new category navigation bar */}
        {children}
        <Footer />
      </body>
    </html>
  );
}