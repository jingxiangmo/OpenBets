import { Webhook } from "svix";
import { headers } from "next/headers";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";

import { createUser, deleteClerkUser, updateUser } from "../../../db/queries";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const clerkId = evt.data.id!;
  const eventType = evt.type;
  console.log(eventType);

  switch (eventType) {
    case "user.created":
    case "user.updated": {
      const { first_name, last_name } = evt.data as UserJSON;
      const dbName = `${first_name!} ${last_name!}`;

      const dbFunc = eventType == "user.created" ? createUser : updateUser;

      const result = await dbFunc({
        clerkId,
        name: dbName,
      });

      break;
    }
    case "user.deleted": {
      const result = await deleteClerkUser(clerkId);
      break;
    }
    default: {
      return new Response("unknown event type", {
        status: 400,
      });
    }
  }

  return new Response("", { status: 200 });
}
