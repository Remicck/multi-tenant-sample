"use client";

import { Button } from "@/app/_components/ui/button";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center m-auto my-6">
      <Button onClick={() => signIn("google")}>
        Sign in with Google signin page
      </Button>
    </div>
  );
}
