import EmailSignUp from "@/components/email-signup";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
    <Navbar />

    {/* 1st screen */}
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 justify-center items-center">
        <h1 className="text-4xl font-bold">Link Code Issues with Contributors</h1>
        <EmailSignUp />
      </div>

      <div className="flex flex-col flex-1 justify-center items-center">
        <img src="logo.png" />
      </div>
    </div>

    <img className="fixed right-3 bottom-3 size-20" src="chatbot.png" />
    </>
  );
}
