"use client";

import { create } from "@/app/_actions/items";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { type Schema, schema } from "@/app/_schemas/create";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Dialog } from "../_components/Dialog";

// bug: https://github.com/vercel/next.js/discussions/58431

// users who are not logged in cannot reach here due to intercepting routes.
export default function Page() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Schema>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const submit: SubmitHandler<Schema> = async (values) => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      try {
        await create(values);
        router.back();
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        }
      }
    });
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Label htmlFor="content">New Memo</Label>
        <Input
          {...register("content")}
          id="content"
          disabled={isPending}
          placeholder="write you memo..."
          className=" w-full focus:outline-none py-3 px-5 rounded-sm"
          data-1p-ignore
        />
        {errors.content?.message && (
          <span className="text-red-400">{errors.content.message}</span>
        )}
      </form>
    </Dialog>
  );
}
