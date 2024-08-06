import { twMerge } from "tailwind-merge";

type Props = React.HTMLAttributes<HTMLDivElement>;

// TODO: unique ids for the radio buttons

export default function YesNoRadio({
  className,
  ...props
}: Props) {
  return (
    <div className={twMerge("mb-4 flex text-center", className)} {...props}>
      <input
        id="yes"
        className="peer/yes size-0"
        type="radio"
        name="yesnoradio"
        required
      />
      <input
        id="no"
        className="peer/no size-0"
        type="radio"
        name="yesnoradio"
        required
      />
      <label
        className="m-2 flex-grow rounded-md border-none bg-green-50 p-0 text-[#1e3050] peer-checked/yes:bg-green-500"
        htmlFor="yes"
      >
        <span className="">✅ Yes</span>
      </label>
      <label
        className="m-2 flex-grow rounded-md border-none bg-red-50 p-0 text-[#1e3050] peer-checked/no:bg-red-500"
        htmlFor="no"
      >
        <span className="">❌ No</span>
      </label>
    </div>
  );
}
