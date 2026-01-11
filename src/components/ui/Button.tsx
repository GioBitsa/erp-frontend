"use client";

import clsx from "clsx";
import Link from "next/link";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonAs = "button" | "link";

type BaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps =
  | (BaseProps &
      React.ButtonHTMLAttributes<HTMLButtonElement> & {
        as?: "button";
      })
  | (BaseProps & {
      as: "link";
      href: string;
    });

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    className,
    children,
    ...rest
  } = props as ButtonProps;

  const styles = clsx(
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
    {
      primary: "bg-primary text-white hover:bg-primary-hover",
      secondary: "border border-border bg-surface text-text hover:bg-surface-2",
      ghost: "text-text hover:bg-surface-2",
    }[variant],
    className
  );

  // 🔹 LINK (route change)
  if (props.as === "link") {
    return (
      <Link href={props.href} className={styles}>
        {children}
      </Link>
    );
  }

  // 🔹 BUTTON (action)
  return (
    <button {...rest} className={styles}>
      {children}
    </button>
  );
}
