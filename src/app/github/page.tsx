// app/page.tsx

import EmbedGithubProject from '@/components/EmbedGithubProject';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <EmbedGithubProject />
    </div>
  );
}
