'use client'
import EmailSignUp from "@/components/email-signup";
import { useAuth } from "@/components/providers";

export default function Home() {
  const { isVerified } = useAuth();

  return (
    <>
    {/* 1st screen */}
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 justify-center items-center">
        <h1 className="text-4xl font-bold">Link Code Issues with Contributors</h1>
        {!isVerified && <EmailSignUp goal="Find Contributors or Contribute to Issues" />}
      </div>

      <div className="flex flex-col flex-1 justify-center items-center">
        <img src="logo.png" />
      </div>
    </div>

    {/* 2nd screen */}
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <h1 className="text-4xl font-bold">Find Talented Contributors</h1>
        <h2 className="text-2xl font-semi-bold">Bashing your head for a bug? Post the issue on GitFries, we will match it with contributors.</h2>
      </div>
      <div className="flex-1">
        <img src="comments-preview.png"/>
      </div>
    </div>

    {/* 3rd screen */}
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <h1 className="text-4xl font-bold">Showcase Skills by Contributing</h1>
        <h2 className="text-2xl font-semi-bold">Want to take part in more real-life projects? Find issues on GitFries and ace your skills while tracking your growth.</h2>
      </div>
      <div className="flex-1">
        <img src="profile-preview.png"/>
      </div>
    </div>

    {/* 4th screen */}
    {!isVerified && 
    <div className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-4xl font-bold">Join GitFries Today</h1>
      <EmailSignUp goal="Find Contributors or Contribute to Issues" />
    </div>
    }
    </>
  );
}
