"use server";

import { options } from "@/app/_clients/nextAuth";
import { prisma } from "@/app/_clients/prisma";
import { type Schema, schema } from "@/app/_schemas/create";
import sendGridClient from "@sendgrid/client";
import sendGridMail from "@sendgrid/mail";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function create(data: Schema) {
  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("invalid schema");
  }

  const session = await getServerSession(options);

  if (!session?.user?.id) {
    throw new Error("no session token");
  }

  const res = await prisma.$transaction(async (prisma) => {
    const res = await prisma.item.create({
      data: {
        content: validatedFields.data.content,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return res;
  });

  // mailを送信する
  try {
    const msg = {
      to: "test@example.com",
      from: "test@example.com", // Use the email address or domain you verified above
      subject: "Sending with Twilio SendGrid is Fun",
      text: `item is : ${validatedFields.data.content}`,
      html: `<strong>item is : ${validatedFields.data.content}</strong>`,
    };

    sendGridClient.setApiKey(process.env.SENDGRID_API_KEY as string);
    sendGridClient.setDefaultRequest(
      "baseUrl",
      process.env.SENDGRID_API_HOST as string,
    );
    sendGridMail.setClient(sendGridClient);

    await sendGridMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error) {
      console.error(error);
    }
  }

  revalidatePath("/");

  return res;
}

export async function deleteAll() {
  const session = await getServerSession(options);

  if (!session?.user?.id) {
    throw new Error("no session token");
  }

  await prisma.$transaction(async (prisma) => {
    await prisma.item.deleteMany({
      where: {
        userId: session.user.id,
      },
    });
  });

  revalidatePath("/");
}
