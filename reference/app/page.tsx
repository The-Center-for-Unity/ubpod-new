import Link from 'next/link';
import Image from 'next/image';
import { getUrantiaPapers } from './data/episodes';

export default function Home() {
  const urantiaPapers = getUrantiaPapers();
  return (
    <div className="container mx-auto px-4 py-8 font-pt-serif">
      <h1 className="text-3xl md:text-4xl font-fira-sans font-black mb-2 text-center">
        Urantia Book Podcast
      </h1>
      <h2 className="text-xl md:text-2xl font-fira-sans font-bold mb-6 text-center text-primary">
        These first AI-generated conversations about the Urantia Papers are truly inspiring!
      </h2>

      {/* Also available on */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-200 rounded-lg p-6 mb-8 shadow-md">
          <div className="flex flex-col items-center">
            <p className="text-lg font-fira-sans font-bold text-primary mb-4">Also available on:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { href: "https://www.youtube.com/playlist?list=PLgU-tjb05MakRB1XmcLKbshw5icSROylV", src: "/images/youtube-button3.png", alt: "YouTube" },
                { href: "https://open.spotify.com/show/4CAEnHQh9MM2rKcxIvYn5V", src: "/images/spotify-button.png", alt: "Spotify" },
                { href: "https://music.amazon.com/podcasts/9ab545ad-4fa8-4678-9704-631f745439fb/the-urantia-book-podcast", src: "/images/amazon-music-button.png", alt: "Amazon Music" },
                { href: "https://podcasts.apple.com/us/podcast/the-urantia-book-podcast/id1774930896", src: "/images/apple-podcast-button.png", alt: "Apple Podcasts" }
              ].map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 rounded-full hover:opacity-80 transition duration-300"
                >
                  <Image 
                    src={item.src} 
                    alt={item.alt} 
                    width={64} 
                    height={64} 
                    className="w-14 h-14 md:w-16 md:h-16"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>


     <h3 className="text-2xl font-fira-sans font-bold mb-4">All Episodes</h3>
      <ul className="space-y-2">
        {urantiaPapers.map((episode, index) => (
          <li key={episode.id}>
            {index === 1 && (
              <div className="my-4 border-t border-gray-300">
                <h3 className="font-fira-sans font-bold text-lg mt-4 mb-2 text-primary">Part I: The Central and Superuniverses</h3>
              </div>
            )}
            {index === 32 && (
              <div className="my-4 border-t border-gray-300">
                <h3 className="font-fira-sans font-bold text-lg mt-4 mb-2 text-primary">Part II: The Local Universe</h3>
              </div>
            )}
            {index === 57 && (
              <div className="my-4 border-t border-gray-300">
                <h3 className="font-fira-sans font-bold text-lg mt-4 mb-2 text-primary">Part III: The History of Urantia</h3>
              </div>
            )}
            {index === 120 && (
              <div className="my-4 border-t border-gray-300">
                <h3 className="font-fira-sans font-bold text-lg mt-4 mb-2 text-primary">Part IV: The Life and Teachings of Jesus</h3>
              </div>
            )}
            <h4 className="text-base font-normal">
              <Link href={`/episode/${episode.id}`} className="text-blue-500 hover:underline">
                {episode.title}
              </Link>
            </h4>
          </li>
        ))}
      </ul>
    </div>
  );
}
