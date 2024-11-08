// app/components/FetchRepoInfo.tsx

'use client';

import { useState } from 'react';
import { Octokit } from '@octokit/core';

export default function FetchRepoContent() {
  const [repoUrl, setRepoUrl] = useState('');
  const [filePath, setFilePath] = useState('');
  const [error, setError] = useState('');
  // const [content, setContent] = useState<any>(null);
  // const [readme, setReadme] = useState<any>(null);
  // const [languages, setLanguages] = useState<any>(null);

  const handleFetchInfo = async () => {
    const regex = /github\.com\/([^/]+)\/([^/]+)(?:\.git)?$/;
    const match = repoUrl.match(regex);

    if (match) {
      const owner = match[1];
      const repo = match[2];

      try {
        const octokit = new Octokit({
          auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN, // Store your GitHub token in env variables
        });

        // Fetch file content
        const contentResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path: filePath,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        // Fetch README
        const readmeResponse = await octokit.request('GET /repos/{owner}/{repo}/readme', {
          owner,
          repo,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        // Fetch Languages
        const languagesResponse = await octokit.request('GET /repos/{owner}/{repo}/languages', {
          owner,
          repo,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        // Set the responses to state
        // setContent(contentResponse.data);
        // setReadme(atob(readmeResponse.data.content)); // Decode Base64 encoded README content
        // setLanguages(languagesResponse.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch repository information');
      }
    } else {
      setError('Invalid GitHub repository URL');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fetch GitHub Repository Info</h1>

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

      <div className="mb-4">
        <label htmlFor="filePath" className="block text-sm font-medium text-gray-700">
          File Path in Repository:
        </label>
        <input
          type="text"
          id="filePath"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Path/to/file.ext"
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleFetchInfo}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Fetch Info
      </button>

      <div className="mt-6">
        {/* {content && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">File Content:</h2>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        )}

        {readme && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">README:</h2>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              {readme}
            </pre>
          </div>
        )}

        {languages && (
          <div>
            <h2 className="text-lg font-semibold">Languages:</h2>
            <ul className="list-disc pl-5">
              {Object.entries(languages).map(([lang, bytes]) => (
                <li key={lang}>
                  {lang}
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>
  );
}
