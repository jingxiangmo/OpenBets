"use client";

import { useState, useEffect } from "react";
import { createClerkSupabaseClient } from "@/utils/supabase/client";
import { useSession, useUser } from "@clerk/nextjs";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";

const BetForm = () => {
  const { user } = useUser();
  const { session } = useSession();
  const [topic, setTopic] = useState("");
  const [resolveCondition, setResolveCondition] = useState("");
  const [resolveBy, setResolveBy] = useState("");
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [wager, setWager] = useState("");
  const [negativeUserId, setNegativeUserId] = useState("");
  const [negativeWager, setNegativeWager] = useState("");

  const handleButtonClick = (button: string) => {
    setSelectedButton(button);
  };

  const handleDateAddition = (days: number) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    setResolveBy(currentDate.toISOString().split("T")[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      console.error("Session is not available");
      return;
    }

    const client = createClerkSupabaseClient(session);
    const userId = user?.id;

    const betData = {
      title: topic,
      resolve_condition: resolveCondition,
      resolve_deadline: resolveBy,
      affirmative_user_clerk_ids: selectedButton === "yes" ? [userId] : [],
      affirmative_user_wagers: selectedButton === "yes" ? [parseFloat(wager)] : [],
      negative_user_clerk_ids: selectedButton === "no" ? [userId] : [negativeUserId],
      negative_user_wagers: selectedButton === "no" ? [parseFloat(wager)] : [parseFloat(negativeWager)],
    };

    console.log("Data about to be posted to database:", betData);

    try {
      const { data, error } = await client
        .from("bet")
        .insert(betData)
        .select();

      if (error) {
        console.error("Error inserting data:", error);
      } else {
        console.log("Bet created successfully:", data);
        // Reset form fields
        setTopic("");
        setResolveCondition("");
        setResolveBy("");
        setSelectedButton(null);
        setWager("");
        setNegativeUserId("");
        setNegativeWager("");
      }
    } catch (error) {
      console.error("Error creating bet:", error);
    }
  };

  return (
    <div className="p-8 sm:w-3/4 md:w-2/3 lg:w-1/2">
      <h2 className="mb-8 text-4xl font-bold">Create a Bet</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-black">Bet Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block h-20 w-full rounded-md border p-2 text-black placeholder-gray-300"
            placeholder="Will Fraser and Guilia date by the end of 2024?"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-black">Resolve Condition (Optional):</label>
          <input
            type="text"
            value={resolveCondition}
            onChange={(e) => setResolveCondition(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2 text-black placeholder-gray-300"
            placeholder="Condition for resolving the bet"
          />
        </div>

        <h1 className="my-4 text-xl font-bold">Your Bet</h1>

        <div className="mb-4 flex">
          <button
            type="button"
            onClick={() => handleButtonClick("yes")}
            className={`m-1 w-1/2 rounded-md border-2 py-2 shadow-sm ${
              selectedButton === "yes"
                ? "bg-green-500 text-black"
                : "text-black hover:bg-green-200"
            }`}
          >
            ✅ Yes
          </button>

          <button
            type="button"
            onClick={() => handleButtonClick("no")}
            className={`m-1 w-1/2 rounded-md border-2 py-2 shadow-sm ${
              selectedButton === "no"
                ? "bg-red-500 text-black"
                : "text-black hover:bg-red-200"
            }`}
          >
            ❌ No
          </button>
        </div>

        <div className="flex gap-3">
          <div className="mb-4 w-1/2">
            <label className="block text-black">Wager ($):</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                $
              </span>
              <input
                type="text"
                value={wager}
                onChange={(e) => setWager(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2 pl-7 text-black placeholder-gray-200 shadow-sm"
                placeholder="10"
                required
              />
            </div>
          </div>

          <div className="mb-4 w-1/2">
            <label className="block text-black">Resolve by:</label>
            <input
              type="date"
              value={resolveBy}
              onChange={(e) => setResolveBy(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2 text-black placeholder-gray-100"
              required
              style={{ color: resolveBy === "" ? "#d3d3d3" : "black" }}
            />

            <div className="mt-2 flex justify-between">
              <button
                type="button"
                onClick={() => handleDateAddition(1)}
                className="text-xs text-blue-500 underline"
              >
                1 day
              </button>
              <button
                type="button"
                onClick={() => handleDateAddition(7)}
                className="text-xs text-blue-500 underline"
              >
                7 days
              </button>
              <button
                type="button"
                onClick={() => handleDateAddition(90)}
                className="text-xs text-blue-500 underline"
              >
                90 days
              </button>
            </div>
          </div>
        </div>
          
        <h1 className="my-4 text-xl font-bold">Opponent Bet</h1>


        <div className="mb-4">
          <label className="block text-black">Opponent Name</label>
          <input
            type="text"
            value={negativeUserId}
            onChange={(e) => setNegativeUserId(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2 text-black placeholder-gray-300"
            placeholder="name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-black">Opponent's Wager ($):</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              type="text"
              value={negativeWager}
              onChange={(e) => setNegativeWager(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2 pl-7 text-black placeholder-gray-200 shadow-sm"
              placeholder="10"
            />
          </div>
        </div>

        <SignedIn>
          <button
            type="submit"
            className="mx-auto my-5 h-12 w-full transform rounded-md bg-blue-500 py-2 text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95"
          >
            🤝 Open Bet
          </button>
         </SignedIn>

        <SignedOut>
          <SignUpButton>
            <button
              type="button"
              className="mx-auto my-5 h-12 w-full transform rounded-md bg-blue-500 py-2 text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95"
            >
              🤝 Signup to Bet
            </button>
          </SignUpButton>
        </SignedOut>
      </form>
    </div>
  );
};

export default BetForm;