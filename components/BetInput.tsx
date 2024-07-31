import React from 'react';
import Button from './Button';

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
        <Button
          onClick={() => onButtonClick("yes")}
          color={selectedButton === "yes" ? "bg-green-500" : "bg-green-50"}
          className="m-1 w-1/2"
        >
          ✅ Yes
        </Button>

        <Button
          onClick={() => onButtonClick("no")}
          color={selectedButton === "no" ? "bg-red-500" : "bg-red-50"}
          className="m-1 w-1/2"
        >
          ❌ No
        </Button>
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
            className="mt-1 block w-full rounded-md border border-gray-200 p-2 pl-7 text-black placeholder-gray-200 shadow-sm"
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