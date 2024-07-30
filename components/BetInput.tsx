import React from 'react';

interface BetInputProps {
  name: string;
  selectedButton: string | null;
  wager: string;
  probability: number | "";
  onNameChange: (value: string) => void;
  onButtonClick: (button: string) => void;
  onWagerChange: (value: string) => void;
  onProbabilityChange: (value: number | "") => void;
  showName?: boolean;
}

const BetInput: React.FC<BetInputProps> = ({
  name,
  selectedButton,
  wager,
  probability,
  onNameChange,
  onButtonClick,
  onWagerChange,
  onProbabilityChange,
  showName = false,
}) => {
  return (
    <div>
      {showName && (
        <div className="mb-4">
          <label className="block text-black">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2 text-black placeholder-gray-300"
            placeholder="Enter name"
            required
          />
        </div>
      )}

      <div className="mb-4 flex">
        <button
          type="button"
          onClick={() => onButtonClick("yes")}
          className={`m-1 w-1/2 h-10 rounded-md border-2 shadow-sm ${
            selectedButton === "yes"
              ? "bg-green-500 text-black"
              : "text-black hover:bg-green-200"
          }`}
        >
          ✅ Yes
        </button>

        <button
          type="button"
          onClick={() => onButtonClick("no")}
          className={`m-1 w-1/2 h-10 rounded-md border-2 shadow-sm ${
            selectedButton === "no"
              ? "bg-red-500 text-black"
              : "text-black hover:bg-red-200"
          }`}
        >
          ❌ No
        </button>
      </div>

      <div className="flex mb-3">
        <div className="mb-4 w-1/2 pr-2">
          <label className=" block text-black">Wager ($):</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              type="text"
              value={wager}
              onChange={(e) => onWagerChange(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2 pl-7 text-black placeholder-gray-200 shadow-sm"
              placeholder="10"
              required
            />
          </div>
        </div>

        <div className="mb-4 w-1/2 pl-2">
          <label className="block text-black">Enter Probability (%):</label>
          <input
            type="number"
            value={probability}
            onChange={(e) =>
              onProbabilityChange(e.target.value ? parseInt(e.target.value) : "")
            }
            className="mt-1 block w-full rounded-md border p-2 text-black placeholder-gray-300"
            placeholder="(0-100)%"
            min="0"
            max="100"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default BetInput;