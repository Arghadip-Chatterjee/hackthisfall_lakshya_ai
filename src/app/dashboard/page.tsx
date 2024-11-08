"use client";
import React, { useEffect } from 'react';
import { BackgroundLinesDemo } from '@/components/BackgroundLinedemo';
import { CanvasRevealEffectDemo } from '@/components/Canvasdemo';
import { WordPullUpDemo } from '@/components/Wordpullupdemo';
import Logo from "@/assets/logo.jpg"

const Page = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, []);

  return (
    <div>
      <div><BackgroundLinesDemo /></div>
      <div className="my-3 py-3 bg-black text-white text-center font-bold text-4xl h-full font-serif">
        Our Prime Features
      </div>
      <div><CanvasRevealEffectDemo /></div>
      <div className="bg-black h-full"><WordPullUpDemo /></div>
    </div>
  );
};

export default Page;