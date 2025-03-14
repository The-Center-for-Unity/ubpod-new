import Link from 'next/link';
import { getSadlerWorkbooks } from '../data/episodes';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dr. Sadler's Workbooks | Urantia Book Podcast",
  description: "Study workbooks by Dr. William S. Sadler exploring the teachings of The Urantia Book",
};

export default function SadlerWorkbooksPage() {
  const workbooks = getSadlerWorkbooks();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl md:text-4xl font-fira-sans font-black mb-6">
        Dr. Sadler's Workbooks
      </h1>

      <div className="mb-8">
        <p className="text-lg font-pt-serif mb-4">
          Explore Dr. William S. Sadler's detailed study workbooks that examine the teachings of The Urantia Papers.
          Each workbook provides in-depth analysis and insights into specific aspects of The Urantia Papers.
        </p>

        {/* Also Available On Section
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-fira-sans font-bold mb-4">Also Available On</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.youtube.com/@UrantiaBookPodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition duration-300"
            >
              <span>Listen on YouTube</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            <a
              href="https://open.spotify.com/show/7JxNu04qJ8JJCvpELPGvCF"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition duration-300"
            >
              <span>Listen on Spotify</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </a>
          </div>
        </div>
        */}
      </div>

      {/* Workbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workbooks.map((workbook) => (
          <Link
            key={workbook.id}
            href={`/sadler-workbooks/${workbook.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-fira-sans font-bold mb-2">
              {workbook.title}
            </h2>
            <div className="flex items-center text-primary mt-4">
              <span className="mr-2">Listen to Workbook</span>
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
