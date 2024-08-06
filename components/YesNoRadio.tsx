"use client";

import { twMerge } from "tailwind-merge";

export type Choice = "yes" | "no" | null;

type Props = React.HTMLAttributes<HTMLDivElement> & {
  choice: Choice;
  setChoice: (choice: Choice) => void;
};

// TODO: unique ids for the radio buttons

export default function YesNoRadio({
  choice,
  setChoice,
  className,
  ...props
}: Props) {
  return (
    <div className={twMerge("mb-4 flex text-center", className)} {...props}>
      <input
        id="yes"
        className="size-0"
        type="radio"
        name="yesnoradio"
        checked={choice === "yes"}
        onChange={() => setChoice("yes")}
        required
      />
      <input
        id="no"
        className="size-0"
        type="radio"
        name="yesnoradio"
        checked={choice === "no"}
        onChange={() => setChoice("no")}
        required
      />
      <label
        className="m-2 flex-grow rounded-md border-none bg-gray-700 p-0 text-[#1e3050]"
        htmlFor="yes"
      >
        <span className={`duration-40 block -translate-y-1.5 transform rounded-md border-none p-2.5 shadow transition-transform ease-linear hover:-translate-y-2 active:translate-y-0 ${choice === "yes" ? "bg-green-500" : "bg-green-50"}`}>✅ Yes</span>
      </label>
      <label
        className="m-2 flex-grow rounded-md border-none bg-gray-700 p-0 text-[#1e3050]"
        htmlFor="no"
      >
        <span className={`duration-40 block -translate-y-1.5 transform rounded-md border-none p-2.5 shadow transition-transform ease-linear hover:-translate-y-2 active:translate-y-0 ${choice === "no" ? "bg-red-500" : "bg-red-50"}`}>❌ No</span>
      </label>
    </div>
  );
}
