import type { Metadata } from "next";
import { Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/providers/auth-provider";
import { CurrentUserDocProvider } from "@/providers/current-user-doc-provider";
import { AchievementsProvider } from "@/providers/achievements-provider";
import AchievementsWrapper from "@/components/achievements/wrapper";
import { TypesenseProvider } from "@/providers/typesense-provider";
import { ChatProvider } from "@/providers/chat-provider";
import ChatBoxWrapper from "@/components/chats/wrapper";
import ChatBoxAiWrapper from "@/components/chats/wrapper-ai";

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
    <AuthProvider>
      <TypesenseProvider>
        <ChatProvider>
          <CurrentUserDocProvider>
            <AchievementsProvider>
              <html lang="en">
                <body
                  className={`${ubuntuMono.variable} antialiased`}
                >
                  <Navbar />
                  <div className="min-h-screen">
                    {children}
                  </div>
                  <ChatBoxAiWrapper />
                  <ChatBoxWrapper />
                  <AchievementsWrapper />
                  <Footer />
                  <script src="https://unpkg.com/flowbite@3.1.2/dist/flowbite.js"></script>
                </body>
              </html>
            </AchievementsProvider>
          </CurrentUserDocProvider>
        </ChatProvider>
      </TypesenseProvider>
    </AuthProvider>
  );
}
