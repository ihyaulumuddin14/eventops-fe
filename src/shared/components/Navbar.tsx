"use client";

import { Bell, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/features/auth/hooks";

// import { useCurrentUser } from "@/features/user/hooks";
// import { useInvitationCount } from "@/features/invitation/hooks";

const Navbar = () => {
  const _pathname = usePathname();

  // const { data: user, isLoading } = useCurrentUser();
  // const { data: invitationCount = 0 } = useInvitationCount({
  // enabled: !!user,
  // });
  const user = { name: "John Doe" };
  const isLoading = false; // Mock loading state
  const invitationCount = 2;
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="fixed top-0 z-50 h-16 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4 sm:px-8 lg:px-12 2xl:px-16">
        {/* Left: brand + nav */}
        <nav className="w-full flex justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="text-lg font-semibold">EventOps</span>
          </Link>

          {isLoading && (
            <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
          )}
          {user ? (
            <div className="flex items-center gap-6 justify-end">
              <Link
                href="/invitations"
                className="flex justify-center items-center gap-4 relative cursor-pointer"
              >
                <span className="text-base">Invitation</span>
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                  {invitationCount > 9 ? "9+" : invitationCount}
                </span>
                <Bell size={24} />
              </Link>

              <div className="group relative">
                <button
                  type="button"
                  className="flex flex-col items-end rounded-md px-3 py-1 text-right hover:bg-muted focus-visible:bg-muted"
                >
                  <span className="text-sm font-medium leading-tight">
                    {user.name}
                  </span>
                </button>

                {/* pt-2 sebagai "jembatan" supaya hover nggak putus antara trigger dan popup */}
                <div className="invisible absolute right-0 top-full w-44 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-md border bg-background p-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => logout()}
                      disabled={isPending}
                      className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut className="size-4" />
                      {isPending ? "Keluar..." : "Logout"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
