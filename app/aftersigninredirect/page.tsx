"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AfterSignInRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Set the timeout for 5 seconds (5000 milliseconds)
    const timer = setTimeout(() => {
      // Redirect to the target page
      router.push('/');
    }, 5000);

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <h1>Redirecting...</h1>
      <p>You will be redirected to the bet page in a few seconds.</p>
    </div>
  );
};
