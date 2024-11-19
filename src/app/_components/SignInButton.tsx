"use client";

import { Button } from "@/app/_components/ui/button";
import { signIn } from "next-auth/react";

export function SignInButton() {
  return <Button onClick={() => signIn()}>Sign in</Button>;
}
