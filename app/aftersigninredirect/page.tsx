"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from "@clerk/nextjs";

import { useAtom } from "jotai";
import {
  topicAtom,
  resolveByAtom,
  selectedButtonAtom,
  wagerAtom,
  probabilityAtom,
  participantsAtom,
} from "@/atoms";
import { createBetAndWagerFromForm } from '@/actions';

export default function AfterSignInRedirectPage() {
  const router = useRouter();

  const { isSignedIn } = useSession();

  const [topic, setTopic] = useAtom(topicAtom);
  const [resolveBy, setResolveBy] = useAtom(resolveByAtom);
  const [selectedButton, setSelectedButton] = useAtom(selectedButtonAtom);
  const [wager, setWager] = useAtom(wagerAtom);
  const [probability, setProbability] = useAtom(probabilityAtom);
  const [participants, setParticipants] = useAtom(participantsAtom);

  useEffect(() => {
    // Set the timeout for 5 seconds (5000 milliseconds)
    const timer = setTimeout(async () => {
      if (isSignedIn) {
        const betId = await createBetAndWagerFromForm(
          topic,
          new Date(resolveBy),
          parseInt(wager),
          selectedButton === "yes",
          probability as number,
          participants,
        );

        // Reset form fields
        setTopic("");
        setResolveBy("");
        setSelectedButton(null);
        setWager("");
        setProbability(""); // Reset probability
        setParticipants([]);
      }

      // Redirect to the target page
      router.push("/");
    }, 5000);

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, [
    router,

    isSignedIn,

    topicAtom,
    resolveByAtom,
    selectedButtonAtom,
    wagerAtom,
    probabilityAtom,
    participantsAtom,
  ]);

  return (
    <div>
      <h1>Redirecting...</h1>
      <p>You will be redirected to the bet page in a few seconds.</p>
    </div>
  );
};
