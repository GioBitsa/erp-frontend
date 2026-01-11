"use client";

import clsx from "clsx";
import {
  Home,
  Users,
  Mail,
  Settings,
  Grid3X3,
  Phone,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const IconBtn = ({
  children,
  active,
  href,
}: {
  children: React.ReactNode;
  active?: boolean;
  href: string;
}) => {
  const classes = clsx(
    "grid h-10 w-10 place-items-center rounded-xl transition cursor-pointer",
    active ? "bg-surface/90 text-primary" : "text-white/90 hover:bg-white/15"
  );

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-18 flex-col items-center gap-3 rounded-2xl bg-primary py-4 shadow-(--shadow-md) md:flex">
      <IconBtn href="/" active={pathname === "/"}>
        <Home size={18} />
      </IconBtn>

      <div className="mt-2 flex flex-col gap-2">
        <IconBtn href="/dashboard" active={pathname.startsWith("/dashboard")}>
          <Grid3X3 size={18} />
        </IconBtn>

        <IconBtn href="/inquiries" active={pathname.startsWith("/inquiries")}>
          <Users size={18} />
        </IconBtn>

        <IconBtn href="/messages" active={pathname.startsWith("/messages")}>
          <Mail size={18} />
        </IconBtn>

        <IconBtn href="/calls" active={pathname.startsWith("/calls")}>
          <Phone size={18} />
        </IconBtn>

        <IconBtn href="/chat" active={pathname.startsWith("/chat")}>
          <MessageSquare size={18} />
        </IconBtn>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <IconBtn href="/settings" active={pathname.startsWith("/settings")}>
          <Settings size={18} />
        </IconBtn>

        <div className="mt-1 h-10 w-10 overflow-hidden rounded-xl bg-white/20" />
      </div>
    </aside>
  );
}
