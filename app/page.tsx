'use client'

import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/chat" className="text-lg font-serif font-thin shadow px-2 py-1 rounded-lg hover:text-gray-600">
        Let&apos;s chat with AI(s).
      </Link>
    </>
  );
}

