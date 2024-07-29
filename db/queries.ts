import "server-only"

import { db } from ".";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

export async function createUser(user: schema.InsertUser) {
  return await db.insert(schema.usersTable).values(user);
}

export async function updateUser({ name, clerkId }: schema.InsertUser) {
  return await db
    .update(schema.usersTable)
    .set({
      name,
    })
    .where(eq(schema.usersTable.clerkId, clerkId!));
}
