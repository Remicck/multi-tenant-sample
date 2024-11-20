"use client";

import { create } from "@/app/_actions/setup";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { type Schema, setupTenantSchema } from "@/app/_schemas/setup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Suspense, useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

export default async function Page() {
  return (
    <div className="space-y-5">
      <Suspense fallback={<p>loading ...</p>}>
        <Setup />
      </Suspense>
    </div>
  );
}

async function Setup() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Schema>({
    mode: "onChange",
    resolver: zodResolver(setupTenantSchema),
  });

  const submit: SubmitHandler<Schema> = async (values) => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      try {
        await create(values);
        router.push("/");
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        }
      }
    });
  };

  return (
    <>
      <h1>テナント情報の登録</h1>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Label htmlFor="name">テナント名</Label>
        <Input
          {...register("name")}
          id="name"
          disabled={isPending}
          placeholder="テナント名を入れてください"
          className=" w-full focus:outline-none py-3 px-5 rounded-sm"
          data-1p-ignore
        />
        <Label htmlFor="name">代表メールアドレス</Label>
        <Input
          {...register("contactEmail")}
          id="contactEmail"
          disabled={isPending}
          placeholder="代表メールアドレスを入れてください"
          className=" w-full focus:outline-none py-3 px-5 rounded-sm"
          data-1p-ignore
        />
        <Button type="submit">登録</Button>
        <div>
          {errors.name?.message && (
            <p className="text-red-400">{errors.name.message}</p>
          )}
          {errors.contactEmail?.message && (
            <p className="text-red-400">{errors.contactEmail.message}</p>
          )}
        </div>
      </form>
    </>
  );
}
