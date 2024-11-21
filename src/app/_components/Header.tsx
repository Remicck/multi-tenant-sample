import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { options } from "../_clients/nextAuth";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

export async function Header() {
  const session = await getServerSession(options);

  return (
    <header className="px-8 py-3 flex items-center justify-between">
      {session?.user?.image ? (
        <Image
          src={session?.user?.image}
          width={40}
          height={40}
          className="rounded-full"
          alt={session?.user?.name ?? "no name"}
          priority
        />
      ) : (
        <i className="w-10 h-10 rounded-full" />
      )}
      <div className="flex gap-4 items-center">
        {session && (
          <Link href="/create" scroll={false}>
            Add an item
          </Link>
        )}
        {session ? <SignOutButton /> : <SignInButton />}
      </div>
    </header>
  );
}
