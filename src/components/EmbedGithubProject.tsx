// app/components/EmbedGithubProject.tsx

'use client';

import { useState } from 'react';
import sdk from '@stackblitz/sdk';

export default function EmbedGithubProject() {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  
  const handleEmbed = () => {
    // Regex to extract username and repo name from URL
    const regex = /github\.com\/([^/]+)\/([^/]+)(?:\.git)?$/;
    const match = repoUrl.match(regex);

    if (match) {
      const username = match[1];
      const repository = match[2];

      // Embed the GitHub project using StackBlitz SDK
      sdk.embedGithubProject('embed', `${username}/${repository}`, {
        terminalHeight: 45,
      });

      setError(''); // Clear any previous errors
    } else {
      setError('Invalid GitHub repository URL');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Embed GitHub Project</h1>
      
      <div className="mb-4">
        <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700">
          GitHub Repository URL:
        </label>
        <input
          type="text"
          id="repoUrl"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="https://github.com/username/repository-name"
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleEmbed}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Embed Project
      </button>

      <div id="embed" className="mt-6 h-[500px] border rounded-md"></div>
    </div>
  );
}
