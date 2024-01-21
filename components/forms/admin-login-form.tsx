"use client";

import { useState, HTMLAttributes, useTransition } from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, SignUpSchemaType } from "@/schema/auth-form.schema";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { logIn } from "@/actions/admin/admin-login";

interface AuthFormProps extends HTMLAttributes<HTMLDivElement> {
  auth: "login" | "sign-up";
}

export function AdminLoginForm({ className, auth, ...props }: AuthFormProps) {
  const [loading, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });

  const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
    startTransition(async () => {
      const error = await logIn(data);
      return setServerError(error?.message);
    });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form method='post' onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input {...register("email", { required: true })} id='email' placeholder='name@example.com' type='email' autoCapitalize='none' autoComplete='email' autoCorrect='off' disabled={loading} />
          </div>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='password'>
              Password
            </Label>
            <Input {...register("password")} id='password' placeholder='Must have at least 8 characters' type='password' disabled={loading} />
          </div>
          <Button disabled={loading}>
            {loading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            {auth == "sign-up" ? "Sign Up" : "Login"}
          </Button>
          <div className='text-sm text-destructive/70 grid '>
            {errors.email && <span>* {errors.email.message}</span>}
            {errors.password && <span>* {errors.password.message}</span>}
            {serverError && <span>* {serverError}</span>}
          </div>
        </div>
      </form>
    </div>
  );
}
