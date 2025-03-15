'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { getHistoryEpisodes } from '../../data/episodes';
import ContactForm from '../../components/ContactForm';
import { track } from '@vercel/analytics';

type Props = {
  params: { id: string }
};

export default function EpisodeClient({ params }: Props) {
  const episodeId = parseInt(params.id);
  const episode = getHistoryEpisodes().find(ep => ep.id === episodeId);
  const [audioExists, setAudioExists] = useState<boolean | null>(null);
  const [sourceExists, setSourceExists] = useState<boolean | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playDuration, setPlayDuration] = useState(0);

  useEffect(() => {
    if (episode) {
      // Check audio
      if (episode.audioUrl) {
        fetch(episode.audioUrl, { method: 'HEAD' })
          .then(response => setAudioExists(response.ok))
          .catch(() => setAudioExists(false));
      } else {
        setAudioExists(false);
      }

      // Check source material
      if (episode.pdfUrl) {
        fetch(episode.pdfUrl, { method: 'HEAD' })
          .then(response => setSourceExists(response.ok))
          .catch(() => setSourceExists(false));
      } else {
        setSourceExists(false);
      }
    }
  }, [episode]);

  // Audio tracking effect
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && episode) {
      const handlePlay = () => {
        const eventData = { episodeId: episode.id, title: episode.title };
        track('Audio Play', eventData);
        console.log('Audio Play:', eventData);
        setPlayDuration(0);
      };

      const handlePause = () => {
        const eventData = { 
          episodeId: episode.id, 
          title: episode.title,
          duration: Math.round(playDuration)
        };
        track('Audio Pause', eventData);
        console.log('Audio Pause:', eventData);
      };

      const handleEnded = () => {
        const eventData = { 
          episodeId: episode.id, 
          title: episode.title,
          duration: Math.round(audio.duration)
        };
        track('Audio Ended', eventData);
        console.log('Audio Ended:', eventData);
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [episode, playDuration]);

  if (!episode) {
    return <div className="container mx-auto p-4 font-pt-serif">Episode not found</div>;
  }

  const prevEpisode = getHistoryEpisodes().find(ep => ep.id === episodeId - 1);
  const nextEpisode = getHistoryEpisodes().find(ep => ep.id === episodeId + 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Mobile Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 lg:hidden">
          {episode.title}
        </h1>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Image and Audio (on mobile) */}
          <div className="space-y-6">
            {/* Image with Hover Effect */}
            <div className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={episode.imageUrl || '/images/history/default.jpg'}
                alt={episode.title}
                width={600}
                height={600}
                className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <a 
                    href={episode.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white/90 hover:bg-white text-sky-900 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors"
                  >
                    Learn More →
                  </a>
                </div>
              </div>
            </div>

            {/* Audio Player on Mobile */}
            <div className="lg:hidden">
              <div className="bg-white rounded-xl shadow-lg p-6">
                {audioExists !== null && (
                  audioExists ? (
                    <audio 
                      ref={audioRef}
                      controls 
                      className="w-full" 
                      src={episode.audioUrl}
                    ></audio>
                  ) : (
                    <p className="text-gray-500 font-medium">Audio coming soon...</p>
                  )
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              {prevEpisode && (
                <Link 
                  href={`/history/${prevEpisode.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </Link>
              )}
              {nextEpisode && (
                <Link 
                  href={`/history/${nextEpisode.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            {/* Desktop Title */}
            <div className="hidden lg:block">
              <h1 className="text-4xl font-bold text-gray-900">
                {episode.title}
              </h1>
            </div>

            {/* Audio Player on Desktop */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl shadow-lg p-6">
                {audioExists !== null && (
                  audioExists ? (
                    <audio 
                      ref={audioRef}
                      controls 
                      className="w-full" 
                      src={episode.audioUrl}
                    ></audio>
                  ) : (
                    <p className="text-gray-500 font-medium">Audio coming soon...</p>
                  )
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-gray-700">{episode.description}</p>
            </div>

            {/* Learn More Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-fira-sans font-bold text-primary">Learn More</h2>
              <div className="space-y-3">
                <a 
                  href={episode.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary hover:text-primary-dark transition-colors font-fira-sans"
                >
                  Read More About This Topic →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12">
          <ContactForm />
        </div>
      </main>
    </div>
  );
} 