"use server";

import { options } from "@/app/_clients/nextAuth";
import { prisma } from "@/app/_clients/prisma";
import { type Schema, setupTenantSchema } from "@/app/_schemas/setup";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function create(data: Schema) {
  const validatedFields = setupTenantSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("invalid schema");
  }

  const session = await getServerSession(options);

  if (!session?.user?.id) {
    throw new Error("no session token");
  }

  const res = await prisma.$transaction(async (prisma) => {
    const res = await prisma.tenant.create({
      data: {
        ...validatedFields.data,
        users: {
          create: {
            userId: session.user.id,
            role: "owner",
          },
        },
      },
    });

    return res;
  });

  revalidatePath("/");

  return res;
}
