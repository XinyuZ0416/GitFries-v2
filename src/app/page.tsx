'use client'
import EmailSignUp from "@/components/email-signup";
import { useAuthProvider } from "@/providers/auth-provider";
import { useNavbarProvider } from "@/providers/navbar-provider";

export default function Home() {
  const { isVerified } = useAuthProvider();
  const { height } = useNavbarProvider();
  const navbarHeight = height ?? 64;

  return (
    <>
    {/* 1st screen */}
    <div className="flex mx-2" style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
      <div className="flex flex-col flex-1 justify-center items-center">
        <h1 className="text-4xl font-bold text-center">Link Code Issues with Contributors</h1>
        { isVerified !== null && !isVerified  && <EmailSignUp goal="Find Contributors or Contribute to Issues" /> }
      </div>

      <div className="flex flex-col flex-1 justify-center items-center">
        <img src="logo.png" />
      </div>
    </div>

    {/* 2nd screen */}
    <div className="flex flex-col mx-4" style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
      <div className="flex-1">
        <h1 className="text-4xl font-bold">Find Talented Contributors</h1>
        <h2 className="text-2xl font-semi-bold">Scratching your head for a bug? Post the issue on GitFries and find contributors.</h2>
      </div>
      {/* <div className="flex-1">
        <img src="comments-preview.png"/>
      </div> */}
    </div>

    {/* 3rd screen */}
    <div className="flex flex-col mx-4" style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
      <div className="flex-1">
        <h1 className="text-4xl font-bold">Showcase Skills by Contributing</h1>
        <h2 className="text-2xl font-semi-bold">Want to take part in more real-life projects? Fix issues on GitFries and track your growth.</h2>
      </div>
      {/* <div className="flex-1">
        <img src="profile-preview.png"/>
      </div> */}
    </div>

    {/* 4th screen */}
    { isVerified !== null && !isVerified && 
    <div className="flex flex-col mx-4 justify-center items-center" style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
      <h1 className="text-4xl font-bold">Join GitFries Today</h1>
      <EmailSignUp goal="Find Contributors or Contribute to Issues" />
    </div>
    }
    </>
  );
}
