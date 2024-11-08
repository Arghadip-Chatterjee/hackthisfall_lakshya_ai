// app/page.tsx

// import FetchRepoContent from '@/components/FetchRepoContent';
import QuestionGenerator from '@/components/QuestionGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* <FetchRepoContent /> */}
      <QuestionGenerator/>
    </div>
  );
}
