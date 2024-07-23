"use client";

import { useState } from "react";
import { SignUpButton, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

const BetForm = () => {
  const [topic, setTopic] = useState("");
  const [money, setMoney] = useState("");
  const [resolveBy, setResolveBy] = useState("");
  const [selectedButton, setSelectedButton] = useState(null);
  const [showAwayBet, setShowAwayBet] = useState(false);
  const [awayMoney, setAwayMoney] = useState("");

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
    <div className="sm:w-3/4 md:w-2/3 lg:w-1/2 p-8">
      <h2 className="text-4xl font-bold mb-8">Create a Bet</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-black">Bet Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block p-2 h-20 w-full border rounded-md text-black placeholder-gray-300"
            placeholder="Will Fraser and Guilia date by the end of 2024?"
            required
          />
        </div>

        <h1 className="text-2xl font-bold my-4">Home Bet</h1>

        <div className="mb-4 flex">
          <button
            type="button"
            onClick={() => handleButtonClick("yes")}
            className={`w-1/2 m-1 py-2 border-2 shadow-sm rounded-md ${
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
            className={`w-1/2 m-1 py-2 border-2 shadow-sm rounded-md ${
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
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="text"
                value={money}
                onChange={(e) => setMoney(e.target.value)}
                className="p-2 pl-7 mt-1 block w-full border border-gray-200 rounded-md shadow-sm text-black placeholder-gray-200"
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
              className="p-2 mt-1 block w-full border rounded-md text-black placeholder-gray-100"
              required
              style={{ color: resolveBy === "" ? "#d3d3d3" : "black" }}
            />

            <div className="flex justify-between mt-2">
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
            <div className="mt-4 p-4 rounded-md shadow-sm bg-gray-100">
              <h1 className="text-xl font-bold my-4">Away Bet (Optional)</h1>
              <div className="mb-4 w-1/2">
                <label className="block text-black">Wager ($):</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    value={awayMoney}
                    onChange={(e) => setAwayMoney(e.target.value)}
                    className="p-2 pl-7 mt-1 block w-full border border-gray-200 rounded-md shadow-sm text-black placeholder-gray-200"
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
            className="w-full my-5 h-12 bg-blue-500 text-white py-2 rounded-md mx-auto transition-transform duration-200 ease-in-out transform hover:shadow-lg hover:scale-105 active:scale-95"
          >
            🤝 Open Bet
          </button>
          <SignOutButton />
        </SignedIn>

        <SignedOut>
          <SignUpButton>
            <button
              type="button"
              className="w-full my-5 h-12 bg-blue-500 text-white py-2 rounded-md mx-auto transition-transform duration-200 ease-in-out transform hover:shadow-lg hover:scale-105 active:scale-95"
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
