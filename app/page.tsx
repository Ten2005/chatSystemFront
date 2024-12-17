'use client'

import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/chat" className="text-2xl shadow-md border border-gray-100 px-2 py-1 rounded-xl hover:text-gray-600">
        Let&apos;s chat with AI(s).
      </Link>
    </>
  );
}

