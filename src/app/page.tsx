'use client';

import Timer from '@/components/Timer';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <Timer />
    </main>
  );
}