import "server-only";

import { User } from "@clerk/nextjs/server";

export type ClerkMetadata = {
  databaseId: number;
};

// TODO: fallback to pulling id frmo the database, just find id by clerkId
export async function dbIdFromClerkId(user: User): Promise<number> {
  return (user.privateMetadata as ClerkMetadata).databaseId;
}
