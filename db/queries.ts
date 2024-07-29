import "server-only"

import { db } from ".";
import * as schema from "./schema";

export async function createUser(user: schema.InsertUser) {
  return await db.insert(schema.usersTable).values(user);
}
