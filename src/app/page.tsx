'use client'
import EmailSignUp from "@/components/email-signup";
import FeatureIntro from "@/components/feature-intro";
import { useAuthProvider } from "@/providers/auth-provider";
import { useNavbarProvider } from "@/providers/navbar-provider";
import { motion } from "framer-motion";
import { fadeInUp } from "../utils/animation";

export default function Home() {
  const { isVerified } = useAuthProvider();
  const { height } = useNavbarProvider();
  const navbarHeight = height ?? 64;

  return (
    <>
    <div className="homepage">
    {/* 1st screen */}
    <motion.div className="flex mx-auto px-4 max-w-7xl w-full" style={{ height: `calc(100vh - ${navbarHeight}px)` }}
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3}} variants={fadeInUp}>
      <div className="flex flex-col flex-1 ml-10 justify-center items-center">
        <h1 className="text-7xl font-bold text-center">Link Code Issues with Contributors</h1>
        { isVerified !== null && !isVerified  && <EmailSignUp goal="Outsource or Contribute to Code Repo Issues" /> }
      </div>

      <div className="flex flex-col flex-1 justify-center items-center">
        <img src="logo.png" className="w-full max-w-md object-contain" />
      </div>
    </motion.div>

    {/* 2nd screen */}
    <motion.div className="flex flex-col mx-4 my-24 text-center"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3}} variants={fadeInUp}>
      <FeatureIntro />
    </motion.div>
    

    {/* 3rd screen */}
    <motion.div className="grid grid-flow-row grid-cols-2 mx-4 my-24 text-center"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3}} variants={fadeInUp}>
      <div className="flex flex-col flex-1 justify-center items-center mx-2">
        <h1 className="text-7xl font-bold mb-4">Find Talented Contributors</h1>
        <h2 className="text-4xl font-semi-bold mb-6">Scratching your head for a bug? Post the issue on GitFries and find contributors.</h2>
      </div>
      <div>
        <img src="3rd.png" className="max-w-full h-auto object-contain rounded-xl shadow-md" />
      </div>
    </motion.div>

    {/* 4th screen */}
    <motion.div className="grid grid-flow-row grid-cols-2 mx-4 my-24 text-center"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3}} variants={fadeInUp}>
      <div>
        <img src="4th.png" className="max-w-full h-auto object-contain rounded-xl shadow-md" />
      </div>
      <div className="flex flex-col flex-1 justify-center items-center mx-2">
        <h1 className="text-7xl font-bold mb-4">Showcase Skills by Contributing</h1>
        <h2 className="text-4xl font-semi-bold mb-6">Want to take part in more real-life projects? Fix issues on GitFries and track your growth.</h2>
      </div>
    </motion.div>

    {/* 5th screen */}
    { isVerified !== null && !isVerified && 
    <motion.div className="flex flex-col mx-4 justify-center items-center" style={{ height: `calc(100vh - ${navbarHeight}px)` }}
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3}} variants={fadeInUp}>
      <h1 className="text-7xl font-bold">Join GitFries Today</h1>
      <EmailSignUp goal="Outsource or Contribute to Code Repo Issues" />
    </motion.div>
    }
    </div>
    </>
  );
}
