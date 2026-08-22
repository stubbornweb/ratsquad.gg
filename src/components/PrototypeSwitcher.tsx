"use client";

/**
 * PROTOTYPE — throwaway. Floating bar for flipping between UI variants.
 * Hidden in production builds so a stray merge cannot ship it.
 */

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  variants: { key: string; name: string }[];
  current: string;
  /** Extra cross-variant controls (login state, empty vs filled, …). */
  children?: React.ReactNode;
};

export function PrototypeSwitcher({ variants, current, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const index = Math.max(
    0,
    variants.findIndex((v) => v.key === current),
  );

  const go = (delta: number) => {
    const next = variants[(index + delta + variants.length) % variants.length];
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", next.key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-0 left-1/2 z-[500] flex max-w-[100vw] -translate-x-1/2 flex-wrap items-stretch justify-center border-2 border-white bg-black font-mono text-[10px] tracking-widest text-white uppercase shadow-[0_8px_32px_rgba(0,0,0,0.8)] sm:bottom-5 sm:text-[11px]">
      <button
        onClick={() => go(-1)}
        aria-label="Попередній варіант"
        className="flex items-center px-3 transition-colors duration-150 hover:bg-white hover:text-black"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex min-w-[160px] items-center justify-center border-x-2 border-white px-4 py-3 sm:min-w-[280px]">
        {variants[index].key} — {variants[index].name}
      </div>

      <button
        onClick={() => go(1)}
        aria-label="Наступний варіант"
        className="flex items-center px-3 transition-colors duration-150 hover:bg-white hover:text-black"
      >
        <ChevronRight size={16} />
      </button>

      {children ? (
        <div className="flex w-full items-stretch border-t-2 border-white sm:w-auto sm:border-t-0 sm:border-l-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** A single toggle inside the bar's extras slot. */
export function PrototypeToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`border-r border-white/30 px-4 transition-colors duration-150 last:border-r-0 ${
        active ? "bg-white text-black" : "hover:bg-white/20"
      }`}
    >
      {label}
    </button>
  );
}
