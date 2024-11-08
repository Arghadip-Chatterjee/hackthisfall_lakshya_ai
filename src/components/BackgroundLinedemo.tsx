import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { PulsatingButtonDemo } from "./Pulsatingbuttondemo";
import { AnimatedGradientTextDemo } from "./Animateddemo";
// import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { ShimmerButtonDemo } from "./Shimmerdemo";
import Logo from "@/assets/logo.jpg"
// import { SignOutButton } from '@/components/SignOutButton'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import Image from 'next/image'

export function BackgroundLinesDemo() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <AnimatedGradientTextDemo />
      <Image src={Logo} width={150}
        height={150}
        alt="Picture of the Logo" 
        className="mt-3 border rounded-lg" />
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Welcome to<br /> Ai Learning Platform
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        Achieve Lakshya powered by AI
      </p>
      <SignedOut><Link href="/sign-in"><div className="mt-4"><PulsatingButtonDemo /></div></Link></SignedOut>
      <SignedIn><Link href="/git"><div className="mt-4"><ShimmerButtonDemo /></div></Link></SignedIn>
      {/* <SignedIn><SignOutButton/></SignedIn> */}
      <SignedIn>
        <UserButton />
      </SignedIn>

    </BackgroundLines>
  );
}
