import EmailSignUp from "@/components/email-signup";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
    <img className="fixed right-3 bottom-3 size-20" src="chatbot.png" />
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

    {/* 2nd screen */}
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 justify-center">
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Issue Reporter</button>
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Contributor</button>
      </div>
      <div className="flex-1 m-10">
        <img src="reporter-preview.png" />
      </div>
      
    </div>
    </>
  );
}
