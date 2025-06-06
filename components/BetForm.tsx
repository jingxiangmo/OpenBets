"use client";

import { useState, useEffect, useCallback } from "react";
import BetInput from "./BetInput";
import Button from "./Button";

import { Participant, createBetAndWagerFromForm } from "../actions";

import { SessionProvider, useSession, signIn } from "next-auth/react";

import { Choice } from "./YesNoRadio";

export default function BetForm() {
  return (
    <SessionProvider>
      <BetFormInside />
    </SessionProvider>
  );
}

function BetFormInside() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);

  const [topic, setTopic] = useState("");
  const [resolveBy, setResolveBy] = useState("");
  const [selectedButton, setSelectedButton] = useState<Choice>(null);
  const [wager, setWager] = useState("");
  const [probability, setProbability] = useState<number | "">(""); // Added state for probability
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", selectedButton: null, wager: "", probability: "" },
  ]);
  const [participantValidations, setParticipantValidations] = useState<boolean[]>([false]);

  useEffect(() => {
    // Load cached form data when component mounts
    const cachedData = localStorage.getItem("cachedBetForm");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setTopic(parsedData.topic || "");
      setResolveBy(parsedData.resolveBy || "");
      setSelectedButton(parsedData.selectedButton || null);
      setWager(parsedData.wager || "");
      setProbability(parsedData.probability || "");
      setParticipants(parsedData.participants || []);
    }
  }, []);

  const handleButtonClick = (button: Choice) => {
    setSelectedButton(button);
  };

  const handleDateAddition = (days: number) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    setResolveBy(currentDate.toISOString().split("T")[0]);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (status !== "authenticated") {
        // Cache form data and redirect to sign-in
        const formData = {
          topic,
          resolveBy,
          selectedButton,
          wager,
          probability,
          participants,
        };
        localStorage.setItem("cachedBetForm", JSON.stringify(formData));
        signIn("google");
        return;
      }

      // Check if all participants have selected a radio button
      participants.forEach((participant, index) => {
        if (!participant.selectedButton) {
          alert(`Please select Yes or No for Participant ${index + 1}.`);
          return;
        }
      });

      try {
        const betId = await createBetAndWagerFromForm(
          topic,
          new Date(resolveBy),
          parseInt(wager),
          selectedButton === "yes",
          probability as number,
          participants,
        );

        // Reset form fields and clear cache
        resetForm();
        localStorage.removeItem("cachedBetForm");

        // Show modal
        setShowModal(true);
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Error creating bet:", error);
      }
    },
    [
      participants,
      probability,
      resolveBy,
      selectedButton,
      status,
      topic,
      wager,
    ],
  );

  useEffect(() => {
    // Auto-submit bet when user logs in
    if (status === "authenticated" && localStorage.getItem("cachedBetForm")) {
      handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    }
  }, [status, handleSubmit]);

  const resetForm = () => {
    setTopic("");
    setResolveBy("");
    setSelectedButton(null);
    setWager("");
    setProbability("");
    setParticipants([
      { name: "", selectedButton: null, wager: "", probability: "" },
    ]);
    setParticipantValidations([false]);
  };

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      { name: "", selectedButton: null, wager: "", probability: "" },
    ]);
    setParticipantValidations(prev => [...prev, false]);
  };

  const handleParticipantChange = (
    index: number,
    field: string,
    value: string | null,
  ) => {
    setParticipants(
      participants.map((participant, i) => {
        if (i === index) {
          return { ...participant, [field]: value };
        }
        return participant;
      }),
    );

    if (field === "selectedButton") {
      setParticipantValidations(prev => {
        const newValidations = [...prev];
        newValidations[index] = value !== null;
        return newValidations;
      });
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
    setParticipantValidations(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto w-full px-4 sm:w-3/4 sm:px-8 md:w-2/3 lg:w-1/2">
      <h2 className="mb-6 text-3xl font-bold text-gray-800 sm:text-4xl">
        Create a Bet
      </h2>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-gray-300 bg-white p-4 sm:p-6"
      >
        <div className="mb-4">
          <label className="mb-2 block font-bold text-gray-700">
            Bet Topic:
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Will my favorite sports team make the playoffs?"
            rows={2}
            maxLength={4096}
            required
          />
        </div>
        <div className="flex">
          <div className="mb-4 w-1/2 pl-2">
            <label className="mb-2 block font-bold text-gray-700">
              Resolve by:
            </label>
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
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                1 day
              </button>
              <button
                type="button"
                onClick={() => handleDateAddition(7)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                7 days
              </button>
              <button
                type="button"
                onClick={() => handleDateAddition(90)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                90 days
              </button>
            </div>
          </div>

          <div className="mb-4 w-1/2 pl-2">
            <label className="mb-2 block font-bold text-gray-700">
              Add to group:
            </label>
            <select className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-400 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <option value="" className="text-gray-200">
                Select a Group
              </option>
              <option value="friends">Friends</option>
            </select>
          </div>
        </div>

        <h1 className="my-4 text-xl font-bold text-gray-800 sm:text-2xl">
          Your Bet
        </h1>

        <BetInput
          ix={-1}
          name=""
          selectedButton={selectedButton}
          wager={wager}
          probability={probability}
          onNameChange={() => {}} // Not used for main user
          onButtonClick={handleButtonClick}
          onWagerChange={setWager}
          onProbabilityChange={setProbability}
        />

        <h1 className="my-4 text-xl font-bold text-gray-800 sm:text-2xl">
          Participants
        </h1>

        {participants.map((participant, index) => (
          <div key={index} className="mb-4 rounded-lg bg-gray-50 p-3 sm:p-4">
            <h1 className="my-3 text-lg font-bold text-gray-800 sm:text-xl">
              Participant {index + 1}
            </h1>

            <BetInput
              ix={index}
              name={participant.name}
              selectedButton={participant.selectedButton}
              wager={participant.wager}
              probability={participant.probability}
              onNameChange={(value) =>
                handleParticipantChange(index, "name", value)
              }
              onButtonClick={(button) =>
                handleParticipantChange(index, "selectedButton", button)
              }
              onWagerChange={(value) =>
                handleParticipantChange(index, "wager", value)
              }
              onProbabilityChange={(value) =>
                handleParticipantChange(
                  index,
                  "probability",
                  value?.toString() ?? null,
                )
              }
              showName={true}
            />

            <button
              type="button"
              onClick={() => handleRemoveParticipant(index)}
              className="mt-2 text-sm font-medium text-gray-400 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="mb-4 flex justify-center">
          <Button
            onClick={handleAddParticipant}
            color="bg-gray-200"
            className="w-1/2"
          >
            + Add Participant
          </Button>
        </div>

        <Button type="submit" className="mx-auto my-4 h-12 w-full">
          {status === "authenticated" ? "🤝 Open Bet" : "🤝 Signup to Bet"}
        </Button>
      </form>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-gray-800">
              Bet Submitted
            </h3>
            <p className="mb-6 text-lg text-gray-600">
              Your bet has been submitted successfully.
            </p>
            <Button onClick={() => setShowModal(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
