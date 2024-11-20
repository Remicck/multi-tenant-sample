import { prisma } from "@/app/_clients/prisma";
import { uuidv7 } from "uuidv7";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { create, deleteAll } from "./items";

describe("actions/items", () => {
  const userId = uuidv7();
  const mock = vi.hoisted(() => ({
    getServerSession: vi.fn(),
    revalidatePath: vi.fn(),
  }));

  vi.mock("next-auth", () => ({
    getServerSession: mock.getServerSession,
  }));

  vi.mock("next/cache", () => ({
    revalidatePath: mock.revalidatePath,
  }));

  beforeEach(async () => {
    mock.getServerSession.mockReturnValue({
      user: {
        id: userId,
      },
    });

    await prisma.user.create({
      data: {
        id: userId,
        email: "hello@a.com",
      },
    });

    // ユーザー数が1よりも多い
    expect(await prisma.user.count()).toBeGreaterThanOrEqual(1);
  });

  afterEach(async () => {
    await Promise.all([prisma.user.deleteMany(), prisma.item.deleteMany()]);
  });

  describe("create", () => {
    test("should create an item", async () => {
      const expected = {
        content: "hello",
        userId: userId,
      };

      expect(
        await create({
          content: "hello",
        }),
      ).toMatchObject(expected);
      expect(mock.revalidatePath.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "/",
        ],
      ]
    `);
      expect(await prisma.item.findMany()).toMatchObject([expected]);
    });

    test("should throw an error if the schema is invalid", async () => {
      await expect(create({ content: "" })).rejects.toThrow("invalid schema");
    });

    test("should throw an error if there is no session token", async () => {
      mock.getServerSession.mockReturnValueOnce(null);

      await expect(create({ content: "hello" })).rejects.toThrow(
        "no session token",
      );
    });
  });

  describe("deleteAll", () => {
    beforeEach(async () => {
      await prisma.item.createMany({
        data: [
          {
            content: "foo",
            userId: userId,
          },
          {
            content: "bar",
            userId: userId,
          },
        ],
      });
    });

    test("should delete all items", async () => {
      expect(await prisma.item.count()).toBe(2);
      await deleteAll();
      expect(await prisma.item.count()).toBe(0);

      expect(mock.revalidatePath.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "/",
          ],
        ]
      `);
    });

    test("should throw an error if there is no session token", async () => {
      mock.getServerSession.mockReturnValueOnce(null);

      await expect(deleteAll()).rejects.toThrow("no session token");
    });
  });
});
