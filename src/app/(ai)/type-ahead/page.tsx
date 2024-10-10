"use client";

import AIEditor from '@/app/(ai)/type-ahead/_components/AIEditor';

export default function TypeAheadPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI-Powered Document Editor</h1>
      <AIEditor />
    </div>
  );
}
