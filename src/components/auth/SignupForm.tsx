"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface SignupFormProps {
  onComplete?: () => void;
}

const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm({ onComplete }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setServerError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Signup failed");
      }

      if (onComplete) onComplete();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 flex items-start">
          <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="username"
            {...register("username")}
            type="text"
            autoComplete="username"
            className={`block w-full rounded-md border ${
              errors.username
                ? "border-red-500 dark:border-red-400"
                : "border-black/[.08] dark:border-white/[.145]"
            } bg-transparent pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-foreground/30`}
            placeholder="johndoe"
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            {...register("email")}
            type="email"
            autoComplete="email"
            className={`block w-full rounded-md border ${
              errors.email
                ? "border-red-500 dark:border-red-400"
                : "border-black/[.08] dark:border-white/[.145]"
            } bg-transparent pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-foreground/30`}
            placeholder="you@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            {...register("password")}
            type="password"
            autoComplete="new-password"
            className={`block w-full rounded-md border ${
              errors.password
                ? "border-red-500 dark:border-red-400"
                : "border-black/[.08] dark:border-white/[.145]"
            } bg-transparent pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-foreground/30`}
            placeholder="••••••••"
          />
        </div>
        {errors.password ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        ) : (
          <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Confirm Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            {...register("confirmPassword")}
            type="password"
            autoComplete="new-password"
            className={`block w-full rounded-md border ${
              errors.confirmPassword
                ? "border-red-500 dark:border-red-400"
                : "border-black/[.08] dark:border-white/[.145]"
            } bg-transparent pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-foreground/30`}
            placeholder="••••••••"
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-foreground text-background py-2 font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] flex items-center justify-center"
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
