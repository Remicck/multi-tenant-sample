import { prisma } from "@/app/_clients/prisma";
import { Button } from "@/app/_components/ui/button";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { deleteAll } from "./_actions/items";
import { options } from "./_clients/nextAuth";
import { format } from "./_utils/date";

export default async function Page() {
  return (
    <div className="space-y-5">
      <Suspense fallback={<p>loading ...</p>}>
        <Status />
      </Suspense>
      <Suspense fallback={<p>loading ...</p>}>
        <List />
      </Suspense>
    </div>
  );
}

async function Status() {
  const session = await getServerSession(options);
  if (session && !session?.user.tenants.length) {
    redirect("/setup");
  }
  return (
    <div className="flex justify-between gap-3 flex-col md:flex-row">
      <p>
        {session?.user
          ? `you are signed in as ${session.user.name} 😄`
          : "you are not signed in 🥲"}
      </p>
      {session?.user && (
        <form action={deleteAll}>
          <Button type="submit">Delete my items</Button>
        </form>
      )}
    </div>
  );
}

async function List() {
  const session = await getServerSession(options);
  const data = !session
    ? []
    : await prisma.item.findMany({
        where: {
          userId: session?.user.id,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

  return (
    <ul className="space-y-4" aria-label="items">
      {data.map(({ id, content, createdAt, user }) => (
        <li
          key={id}
          className="p-4 flex justify-between items-start rounded-lg bg-slate-100"
        >
          <div className="flex justify-center gap-4 items-center">
            {user.image && (
              <Image
                alt={user.name ?? "no name"}
                src={user.image}
                width={56}
                height={56}
                className="rounded-full border-2 border-gray-300"
                priority
              />
            )}
            <h2
              className="font-semibold md:text-xl break-all"
              title="memo title"
            >
              {content}
            </h2>
          </div>
          <span className="text-sm text-gray-500">{format(createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}
