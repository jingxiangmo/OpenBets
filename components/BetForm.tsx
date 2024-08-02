"use client";

import { useState } from "react";
import { useSession } from "@clerk/nextjs";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import BetInput from './BetInput';
import Button from './Button';

import { Participant, createBetAndWagerFromForm } from "../actions";

import { useAtom } from "jotai";

import {
  topicAtom,
  resolveByAtom,
  selectedButtonAtom,
  wagerAtom,
  probabilityAtom,
  participantsAtom,
} from "@/atoms";

const BetForm = () => {
  const { session } = useSession();

  const [showModal, setShowModal] = useState(false);

  const [topic, setTopic] = useAtom(topicAtom);
  const [resolveBy, setResolveBy] = useAtom(resolveByAtom);
  const [selectedButton, setSelectedButton] = useAtom(selectedButtonAtom);
  const [wager, setWager] = useAtom(wagerAtom);
  const [probability, setProbability] = useAtom(probabilityAtom); // Added state for probability
  const [participants, setParticipants] = useAtom(participantsAtom);

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

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: "", selectedButton: null, wager: "", probability: "" }]);
  };

  const handleParticipantChange = (index: number, field: string, value: string | null) => {
    setParticipants(
      participants.map((participant, i) => {
        if (i === index) {
          return { ...participant, [field]: value };
        }
        return participant;
      })
    );
  };

  return (
    <div className="px-4 sm:px-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto">
      <h2 className="mb-6 text-3xl sm:text-4xl font-bold text-gray-800">Create a Bet</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-300">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Bet Topic:</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Will Fraser and Guilia date by the end of 2024?"
            rows={2}
            required
          />
        </div>

        <div className="mb-4 w-full sm:w-2/5">
          <label className="block text-gray-700 font-bold mb-2">Resolve by:</label>
          <input
            type="date"
            value={resolveBy}
            onChange={(e) => setResolveBy(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
            style={{ color: resolveBy === "" ? "#a0aec0" : "black" }}
          />

          <div className="mt-2 flex justify-between">
            <button
              type="button"
              onClick={() => handleDateAddition(1)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              1 day
            </button>
            <button
              type="button"
              onClick={() => handleDateAddition(7)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              7 days
            </button>
            <button
              type="button"
              onClick={() => handleDateAddition(90)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              90 days
            </button>
          </div>
        </div>

        <h1 className="my-4 text-xl sm:text-2xl font-bold text-gray-800">Your Bet</h1>

        <BetInput
          name=""
          selectedButton={selectedButton}
          wager={wager}
          probability={probability}
          onNameChange={() => {}} // Not used for main user
          onButtonClick={handleButtonClick}
          onWagerChange={setWager}
          onProbabilityChange={setProbability}
        />

        <div className="justify-center mb-4">
          <Button onClick={handleAddParticipant} color="bg-gray-200" className="w-full">
            + Add Participants
          </Button>
        </div>

        {participants.map((participant, index) => (
          <div key={index} className="mb-4 bg-gray-50 rounded-lg p-3 sm:p-4">
            <h1 className="my-3 text-lg sm:text-xl font-bold text-gray-800">Participant {index + 1}</h1>

            <BetInput
              name={participant.name}
              selectedButton={participant.selectedButton}
              wager={participant.wager}
              probability={participant.probability}
              onNameChange={(value) => handleParticipantChange(index, "name", value)}
              onButtonClick={(button) => handleParticipantChange(index, "selectedButton", button)}
              onWagerChange={(value) => handleParticipantChange(index, "wager", value)}
              onProbabilityChange={(value) => handleParticipantChange(index, "probability", value?.toString() ?? null)}
              showName={true}
            />
          </div>
        ))}

        <SignedIn>
          <Button type="submit" className="mx-auto my-4 h-12 w-full">
            🤝 Open Bet
          </Button>
        </SignedIn>

        <SignedOut>
          <SignUpButton>
            <Button className="mx-auto my-4 h-12 w-full">
              🤝 Signup to Bet
            </Button>
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
                <div className="mb-4 flex items-center justify-center">
                  <svg
                    className="h-16 w-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <p className="my-4 text-center text-lg leading-relaxed text-green-800">
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
