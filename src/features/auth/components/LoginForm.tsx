"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

import { type LoginFormInput, loginSchema } from "../schema/auth.schema";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormInput) {
    console.log(data);

    // TODO: Integrasikan dengan endpoint login backend.
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Selamat Datang Kembali
        </h1>

        <p className="mt-1 text-sm text-zinc-600">
          Masukkan kredensial panitia atau peserta terdaftar Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FieldGroup>
          {/* Email */}
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Alamat Email</FieldLabel>

            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
                className="h-12 pl-10 pr-10"
              />

              <ShieldCheck className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-sky-700" />
            </div>

            <FieldError errors={[errors.email]} />
          </Field>

          {/* Password */}
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>

            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
                className="h-12 pl-10 pr-11"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>

            <FieldError errors={[errors.password]} />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-12 w-full bg-sky-700 text-base hover:bg-sky-800"
        >
          {isSubmitting ? "Memproses..." : "Masuk ke Platform"}
          {!isSubmitting && <ArrowRight className="ml-1 size-4" />}
        </Button>
      </form>

      <div className="mt-6 border-t pt-5 text-center text-sm text-muted-foreground">
        Belum memiliki akun?
        <p className="mt-1">
          Hubungi koordinator divisi Anda atau{" "}
          <Link
            href="/register"
            className="font-medium text-sky-800 underline underline-offset-4"
          >
            daftar akun peserta baru
          </Link>
          .
        </p>
      </div>
    </>
  );
}
