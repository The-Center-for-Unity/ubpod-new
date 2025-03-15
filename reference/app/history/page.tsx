import Link from 'next/link';
import { getHistoryEpisodes } from '../data/episodes';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "A History of the Urantia Papers | Urantia Book Podcast",
  description: "Explore the fascinating history behind the Urantia Papers, from their mysterious origins to their publication.",
};

export default function HistoryPage() {
  const episodes = getHistoryEpisodes();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl md:text-4xl font-fira-sans font-black mb-6">
        A History of the Urantia Papers
      </h1>

      <div className="mb-8">
        <p className="text-lg font-pt-serif mb-4">
          Join us as we explore the fascinating journey of how the Urantia Papers came to be. 
          From the early investigations of Dr. William S. Sadler to the formation of the Forum 
          and the eventual publication of the book, discover the remarkable story behind this 
          unique revelation.
        </p>
      </div>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <Link
            key={episode.id}
            href={`/history/${episode.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-fira-sans font-bold mb-2">
              {episode.title}
            </h2>
            <div className="flex items-center text-primary mt-4">
              <span className="mr-2">Listen to Episode</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 