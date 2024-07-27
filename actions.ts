"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function userNamesFromIds(userId: string[]) {
  const { data } =  await clerkClient.users.getUserList({
    userId,
  })

  return data.map((user) => user.username);
}
