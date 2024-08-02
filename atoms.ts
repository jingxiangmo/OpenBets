import { atomWithStorage } from "jotai/utils";
import { Participant } from "./actions";

export const topicAtom = atomWithStorage("topic", "");
export const resolveByAtom = atomWithStorage("resolveBy", "");
export const selectedButtonAtom = atomWithStorage<string | null>("selectedButton", null);
export const wagerAtom = atomWithStorage("wager", "");
export const probabilityAtom = atomWithStorage<number | "">("probability", ""); // Added state for probability
export const participantsAtom = atomWithStorage<Participant[]>("participants", []);
