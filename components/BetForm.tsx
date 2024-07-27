"use client";

import { useState } from "react";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";

const BetForm = () => {
  const [topic, setTopic] = useState("");
  const [money, setMoney] = useState("");
  const [resolveBy, setResolveBy] = useState("");
  const [selectedButton, setSelectedButton] = useState(null);
  const [showAwayBet, setShowAwayBet] = useState(false);
  const [awayMoney, setAwayMoney] = useState("");

  const cacheFormData = () => {
    const formData = {
      topic,
      money,
      resolveBy,
      selectedButton,
      awayMoney: showAwayBet ? awayMoney : null,
    };
    localStorage.setItem("betFormData", JSON.stringify(formData));
  };

  const handleSignIn = () => {
    cacheFormData();
    // Trigger sign-in process
  };

  const handleFormSubmit = () => {
    const cachedData = localStorage.getItem("betFormData");
    if (cachedData) {
      const formData = JSON.parse(cachedData);
      console.log(formData);
      // Handle form submission logic with cached data
    }
  };

  const handleButtonClick = (button: any) => {
    setSelectedButton(button);
    // Handle any additional logic for button click, such as database entry
  };

  const handleDateAddition = (days: any) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    setResolveBy(currentDate.toISOString().split("T")[0]);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({
      topic,
      money,
      resolveBy,
      selectedButton,
      awayMoney: showAwayBet ? awayMoney : null,
    });
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

        <h1 className="my-4 text-2xl font-bold">Home Bet</h1>

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
                value={money}
                onChange={(e) => setMoney(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2 pl-7 text-black placeholder-gray-200 shadow-sm"
                placeholder="10"
                required
              />
            </div>
          </div>

          <div className="mb-4 w-1/2">
            <label className="block text-black">Resolve in:</label>
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

        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowAwayBet(!showAwayBet)}
            className="text-gray-300 underline"
          >
            Away Bet (Optional)
          </button>
          {showAwayBet && (
            <div className="mt-4 rounded-md bg-gray-100 p-4 shadow-sm">
              <h1 className="my-4 text-xl font-bold">Away Bet (Optional)</h1>
              <div className="mb-4 w-1/2">
                <label className="block text-black">Wager ($):</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    value={awayMoney}
                    onChange={(e) => setAwayMoney(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 pl-7 text-black placeholder-gray-200 shadow-sm"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <SignedIn>
          <button
            type="submit"
            onClick={handleFormSubmit}
            className="mx-auto my-5 h-12 w-full transform rounded-md bg-blue-500 py-2 text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95"
          >
            🤝 Open Bet
          </button>
          <SignOutButton />
        </SignedIn>

        <SignedOut>
          <SignUpButton>
            <button
              type="button"
              onClick={handleSignIn}
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
