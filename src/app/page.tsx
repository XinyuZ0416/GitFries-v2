'use client'
import EmailSignUp from "@/components/email-signup";
import FeatureIntro from "@/components/feature-intro";
import { useAuthProvider } from "@/providers/auth-provider";
import { useNavbarProvider } from "@/providers/navbar-provider";
import { motion } from "framer-motion";

export default function Home() {
  const { isVerified } = useAuthProvider();
  const { height } = useNavbarProvider();
  const navbarHeight = height ?? 64;
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 50},
    visible: { opacity: 1, y: 0, transition: { duration: 0.6}},
  }

  return (
    <>
    <div className="homepage">
    {/* 1st screen */}
    <motion.div className="flex mx-2" style={{ height: `calc(100vh - ${navbarHeight}px)` }}
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3}} variants={fadeInUp}>
      <div className="flex flex-col flex-1 justify-center items-center">
        <h1 className="text-4xl font-bold text-center">Link Code Issues with Contributors</h1>
        { isVerified !== null && !isVerified  && <EmailSignUp goal="Find Contributors or Contribute to Issues" /> }
      </div>

      <div className="flex flex-col flex-1 justify-center items-center">
        <img src="logo.png" />
      </div>
    </motion.div>

    {/* 2nd screen */}
    <motion.div className="flex flex-col mx-4 my-24 text-center"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3}} variants={fadeInUp}>
      <FeatureIntro />
    </motion.div>
    

    {/* 3rd screen */}
    <motion.div className="flex flex-col mx-4 my-24 text-center"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3}} variants={fadeInUp}>
      <h1 className="text-4xl font-bold mb-4">Find Talented Contributors</h1>
      <h2 className="text-2xl font-semi-bold mb-6">Scratching your head for a bug? Post the issue on GitFries and find contributors.</h2>
      <img src="3rd.png" className="max-w-full h-auto object-contain rounded-xl shadow-md" />
    </motion.div>

    {/* 4th screen */}
    <motion.div className="flex flex-col mx-4 my-24 text-center"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3}} variants={fadeInUp}>
      <h1 className="text-4xl font-bold mb-4">Showcase Skills by Contributing</h1>
      <h2 className="text-2xl font-semi-bold mb-6">Want to take part in more real-life projects? Fix issues on GitFries and track your growth.</h2>
      <img src="4th.png" className="max-w-full h-auto object-contain rounded-xl shadow-md" />
    </motion.div>

    {/* 5th screen */}
    { isVerified !== null && !isVerified && 
    <motion.div className="flex flex-col mx-4 justify-center items-center" style={{ height: `calc(100vh - ${navbarHeight}px)` }}
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3}} variants={fadeInUp}>
      <h1 className="text-4xl font-bold">Join GitFries Today</h1>
      <EmailSignUp goal="Find Contributors or Contribute to Issues" />
    </motion.div>
    }
    </div>
    </>
  );
}
