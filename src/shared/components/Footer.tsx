import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#c0c7d0] bg-white">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:px-8 lg:px-12 2xl:px-16">
        <Link
          href="/events"
          className="shrink-0 text-lg font-bold leading-5 tracking-tight text-[#00517d]"
        >
          BCC
          <br />
          EventOps
        </Link>

        <div className="hidden h-8 w-px bg-[#c0c7d0] sm:block" />

        <p className="text-xs leading-5 text-[#41474f] sm:text-sm">
          © 2026 BCC EventOps. Basic Computing Community,
          <br className="hidden sm:block" /> Fakultas Ilmu Komputer, Universitas
          Brawijaya.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
