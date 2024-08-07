import React from "react";
import Button from "./Button";

import YesNoRadio, { Choice } from "./YesNoRadio";

interface BetInputProps {
  name: string;
  selectedButton: Choice;
  wager: string;
  probability: number | "";
  onNameChange: (value: string) => void;
  onButtonClick: (button: Choice) => void;
  onWagerChange: (value: string) => void;
  onProbabilityChange: (value: number | "") => void;
  showName?: boolean;
  ix: number;
}

const BetInput: React.FC<BetInputProps> = ({
  ix,
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
            maxLength={4096}
            required
          />
        </div>
      )}

      <YesNoRadio
        ix={ix}
        choice={selectedButton}
        setChoice={onButtonClick}
      />
      <div className="mb-3 flex">
        <div className="mb-4 w-1/2 pr-2">
          <label className="block text-black">Wager ($):</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={wager}
              onChange={(e) => onWagerChange(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2 pl-7 text-black placeholder-gray-200 shadow-sm"
              placeholder="10"
              min={1}
              required
            />
          </div>
        </div>

        <div className="mb-4 w-1/2 pl-2">
          <label className="block text-black">Probability (%):</label>
          <input
            type="number"
            value={probability}
            onChange={(e) =>
              onProbabilityChange(
                e.target.value ? parseInt(e.target.value) : "",
              )
            }
            className="mt-1 block w-full rounded-md border border-gray-200 p-2 pl-7 text-black placeholder-gray-200 shadow-sm"
            placeholder="(1-99)%"
            min={1}
            max={99}
            step={1}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default BetInput;
