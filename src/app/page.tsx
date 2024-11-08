"use server";
import { auth } from '@clerk/nextjs/server';
import { SignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation'

export default async function Page() {
  const { userId } = auth();

  console.log(userId);

  // Check if userId is found
  if (userId) {
    redirect(`/dashboard?userId=${userId}`);
    return null;
  } else {
    // Render SignIn component if no userId found
    return <SignIn />;
  }
}
