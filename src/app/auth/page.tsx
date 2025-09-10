"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Auth() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // Update selected tab when URL parameters change
    if (tabParam === "login") {
      setSelectedIndex(0);
    } else if (tabParam === "signup") {
      setSelectedIndex(1);
    }
  }, [tabParam]);

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

        <TabGroup
          selectedIndex={selectedIndex}
          onChange={(index) => {
            setSelectedIndex(index);
            // Update the URL parameter without refreshing the page
            const url = new URL(window.location.href);
            url.searchParams.set("tab", index === 0 ? "login" : "signup");
            window.history.replaceState({}, "", url.toString());
          }}
        >
          <TabList className="mb-6 flex rounded-md border border-solid border-black/[.08] dark:border-white/[.145] p-1">
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
          </TabList>
          <TabPanels>
            <TabPanel>
              <LoginForm onComplete={() => {}} />
            </TabPanel>
            <TabPanel>
              <SignupForm />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
