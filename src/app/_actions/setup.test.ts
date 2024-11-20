import { create } from "@/app/_actions/setup";
import { prisma } from "@/app/_clients/prisma";
import { uuidv7 } from "uuidv7";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("actions/setup", () => {
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
        email: "test@example.com",
      },
    });

    expect(await prisma.user.count()).toBeGreaterThanOrEqual(1);
  });

  afterEach(async () => {
    await Promise.all([
      prisma.tenant.deleteMany(),
      prisma.user.deleteMany({
        where: {
          id: userId,
        },
      }),
    ]);
  });

  describe("create", () => {
    test("should create a tenant with the owner user", async () => {
      const input = {
        name: "Test Tenant",
        contactEmail: "hoge@example.com",
      };

      const expectedTenant = {
        name: "Test Tenant",
        contactEmail: "hoge@example.com",
      };

      const expectedUser = {
        userId: userId,
        role: "owner",
      };

      const result = await create(input);

      expect(result).toMatchObject(expectedTenant);
      const tenants = await prisma.tenant.findMany({
        include: { users: true },
      });

      expect(tenants).toHaveLength(1);
      expect(tenants[0]).toMatchObject(expectedTenant);
      // userが1以上いることを確認する
      expect(tenants[0].users.length).toBeGreaterThan(0);
      expect(tenants[0].users[0]).toMatchObject(expectedUser);

      expect(mock.revalidatePath.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "/",
          ],
        ]
      `);
    });

    test("should throw an error if the schema is invalid", async () => {
      const invalidInput = { name: "", contactEmail: "" };

      await expect(create(invalidInput)).rejects.toThrow("invalid schema");
    });

    test("should throw an error if there is no session token", async () => {
      mock.getServerSession.mockReturnValueOnce(null);

      const input = {
        name: "Test Tenant",
        contactEmail: "hoge@example.com",
      };

      await expect(create(input)).rejects.toThrow("no session token");
    });
  });
});
