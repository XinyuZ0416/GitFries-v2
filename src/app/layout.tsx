import type { Metadata } from "next";
import { Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "GitFries - Link Code Issues with Contributors",
  description: "GitFries links code issues with contributors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntuMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <img className="fixed right-3 bottom-3 size-20 z-9" src="chatbot.png" />
        <Footer />
      </body>
    </html>
  );
}
