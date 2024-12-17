'use client'

import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/chat" className="text-2xl">
        Let&apos;s chat with AI(s).
      </Link>
    </>
  );
}

