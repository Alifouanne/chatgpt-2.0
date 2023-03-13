"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
const Login = () => {
  return (
    <div className="bg-[#11A37F] flex flex-col items-center justify-center h-screen text-center">
      <Image src="/images/logo.png" width={300} height={300} alt="logo" />
      <button
        className="text-white font-bold text-3xl animate-pulse"
        onClick={() => signIn("google")}
      >
        Sign In to use ChatGpt
      </button>
    </div>
  );
};

export default Login;
