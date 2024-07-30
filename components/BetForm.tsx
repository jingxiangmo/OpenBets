"use client";

import { useState, useEffect } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";

import { createBetAndWagerFromForm } from "../actions";

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
  const [showModal, setShowModal] = useState(false);

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

    try {
      const betId = await createBetAndWagerFromForm(
        topic,
        resolveCondition,
        new Date(resolveBy),
        parseInt(wager),
        selectedButton === "yes",
      );

      // Reset form fields
      setTopic("");
      setResolveCondition("");
      setResolveBy("");
      setSelectedButton(null);
      setWager("");
      setNegativeUserId("");
      setNegativeWager("");
      // Show modal
      setShowModal(true);
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block h-20 w-full rounded-md border p-2 text-black placeholder-gray-300"
            placeholder="Will Fraser and Guilia date by the end of 2024?"
            rows={4} 
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-black">Resolve Condition (Optional):</label>
          <textarea
            value={resolveCondition}
            onChange={(e) => setResolveCondition(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2 text-black placeholder-gray-300"
            placeholder="Condition for resolving the bet"
            rows={4} 
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
          <label className="block text-black">Opponent&apos;s Wager ($):</label>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative mx-auto my-6 w-auto max-w-sm">
            <div className="relative flex w-full flex-col rounded-lg border-0 bg-green-100 shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between rounded-t border-b border-solid border-green-200 p-5">
                <h3 className="text-3xl font-semibold text-green-800">
                  Bet Submitted
                </h3>
                <button
                  className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-green-800 opacity-5 outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <span className="block h-6 w-6 bg-transparent text-2xl text-green-800 opacity-5 outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative flex-auto p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="my-4 text-lg leading-relaxed text-green-800 text-center">
                  Your bet has been submitted successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetForm;
