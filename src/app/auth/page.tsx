"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Tab } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Auth() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="w-full max-w-md rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] bg-white dark:bg-[#121212] p-8 shadow-sm">
        <div className="mb-6 flex items-center">
          <Link
            href="/"
            className="mr-4 rounded-full p-2 transition-colors hover:bg-black/[.05] dark:hover:bg-white/[.06]"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium">Account</h1>
        </div>

        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="mb-6 flex rounded-md border border-solid border-black/[.08] dark:border-white/[.145] p-1">
            <Tab
              className={({ selected }) =>
                `flex-1 py-2 text-center text-sm font-medium transition-colors rounded-md
                ${
                  selected
                    ? "bg-foreground text-background"
                    : "hover:bg-black/[.05] dark:hover:bg-white/[.06]"
                }`
              }
            >
              Login
            </Tab>
            <Tab
              className={({ selected }) =>
                `flex-1 py-2 text-center text-sm font-medium transition-colors rounded-md
                ${
                  selected
                    ? "bg-foreground text-background"
                    : "hover:bg-black/[.05] dark:hover:bg-white/[.06]"
                }`
              }
            >
              Sign Up
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <LoginForm onComplete={() => {}} />
            </Tab.Panel>
            <Tab.Panel>
              <SignupForm onComplete={() => setSelectedIndex(0)} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
