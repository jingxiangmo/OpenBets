import React from "react";

import { ClassNameValue, twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: ClassNameValue;
};

export default function Button({
  color = "bg-yellow-300",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        "m-2 rounded-md border-none bg-gray-700 p-0 text-[#1e3050]",
        className,
      )}
    >
      <span
        className={twMerge(
          "duration-40 block -translate-y-1.5 transform rounded-md border-none p-2.5 shadow transition-transform ease-linear hover:-translate-y-2 active:translate-y-0",
          color,
        )}
      >
        {children}
      </span>
    </button>
  );
}
