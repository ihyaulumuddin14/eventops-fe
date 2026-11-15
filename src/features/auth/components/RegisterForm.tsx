"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  User,
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

import { type RegisterFormInput, registerSchema } from "../schema/auth.schema";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(data: RegisterFormInput) {
    console.log(data);

    // TODO: Integrasikan dengan endpoint register backend.
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Daftar Akun Baru
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lengkapi informasi berikut untuk membuat akun.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FieldGroup>
          {/* Name */}
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>

            <div className="relative">
              <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="name"
                type="text"
                placeholder="Nama Lengkap"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
                className="h-12 pl-10"
              />
            </div>

            <FieldError errors={[errors.name]} />
          </Field>

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
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <Field data-invalid={!!errors.confirm_password}>
            <FieldLabel htmlFor="confirm_password">
              Konfirmasi Kata Sandi
            </FieldLabel>

            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi kata sandi"
                autoComplete="new-password"
                aria-invalid={!!errors.confirm_password}
                {...register("confirm_password")}
                className="h-12 pl-10 pr-11"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showConfirmPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>

            <FieldError errors={[errors.confirm_password]} />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-12 w-full bg-sky-700 text-base hover:bg-sky-800"
        >
          {isSubmitting ? "Memproses..." : "Daftar Akun"}
          {!isSubmitting && <ArrowRight className="ml-1 size-4" />}
        </Button>
      </form>

      <div className="mt-6 border-t pt-5 text-center text-sm text-muted-foreground">
        Sudah memiliki akun?
        <p className="mt-1">
          <Link
            href="/login"
            className="font-medium text-sky-800 underline underline-offset-4"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </>
  );
}
