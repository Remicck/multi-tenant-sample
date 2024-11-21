import { options } from "@/app/_clients/nextAuth";
import { getServerSession } from "next-auth";

export async function getUser() {
  const session = await getServerSession(options);
  return session?.user;
}
