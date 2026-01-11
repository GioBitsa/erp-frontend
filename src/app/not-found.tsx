import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-(--shadow-md)">
        <Image
          src="/images/not-found.png"
          alt="Page not found"
          width={220}
          height={160}
          className="mx-auto mb-4"
        />

        <h1 className="text-xl font-semibold text-text">Page not found</h1>

        <p className="mt-2 text-sm text-text-2">
          The page you are looking for doesn’t exist or was moved.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
