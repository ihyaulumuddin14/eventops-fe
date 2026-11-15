"use client";

import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 h-16 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4 sm:px-8 lg:px-12 2xl:px-16">
        <nav className="flex w-full items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="text-lg font-semibold">EventOps</span>
          </Link>

          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
