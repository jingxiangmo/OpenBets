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
    async function submitthing() {
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
    }

    let timer: NodeJS.Timeout;

    submitthing().then(() => {
      timer = setTimeout(async () => {
        // Redirect to the target page
        router.push("/");
      }, 2500);
    });

    return () => clearTimeout(timer);
  }, [
    router,

    isSignedIn,

    topic,
    resolveBy,
    selectedButton,
    wager,
    probability,
    participants,

    setTopic,
    setResolveBy,
    setSelectedButton,
    setWager,
    setProbability,
    setParticipants,
  ]);

  return (
    <div>
      <h1>Redirecting...</h1>
      <p>You will be redirected to the bet page in a few seconds.</p>
    </div>
  );
};
