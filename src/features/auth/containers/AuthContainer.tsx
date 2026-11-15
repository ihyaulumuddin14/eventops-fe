import type { ReactNode } from "react";

const AuthContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="hidden xl:flex flex-col items-center justify-between bg-linear-to-br from-primary to-on-surface text-primary-foreground p-[clamp(2rem,4vw,10rem)]">
        <h2 className="flex flex-col gap-0 self-start">
          <span className="text-base font-semibold">BCC EventOps</span>
          <span className="text-xs font-normal">Operations Management</span>
        </h2>
        <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold max-w-0 lg:max-w-[20ch] text-left self-start">
          Pusat Manajemen Event & Operasi BCC Peeps
        </h1>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AuthContainer;
