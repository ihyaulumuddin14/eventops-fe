"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export function AuthRouteTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = pathname.startsWith("/register") ? "register" : "login";

  function handleTabChange(value: string) {
    router.push(value === "login" ? "/login" : "/register");
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="h-fit w-full flex gap-2 rounded-xl bg-mauve-300 p-1.5 py-5 border">
        <TabsTrigger
          value="login"
          className="h-7.5 rounded-lg text-sm font-semibold transition-all duration-300 data-[state=active]:bg-sky-800 data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Masuk Akun
        </TabsTrigger>

        <TabsTrigger
          value="register"
          className="h-7.5 rounded-lg text-sm font-semibold transition-all duration-300 data-[state=active]:bg-sky-800 data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Daftar Akun Baru
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
