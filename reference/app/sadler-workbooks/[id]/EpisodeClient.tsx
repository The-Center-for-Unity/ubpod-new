'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { getSadlerWorkbooks } from '../../data/episodes';
import ContactForm from '../../components/ContactForm';
import { track } from '@vercel/analytics';

type Props = {
  params: { id: string }
};

export default function EpisodeClient({ params }: Props) {
  const episodeId = parseInt(params.id);
  const episode = getSadlerWorkbooks().find(ep => ep.id === episodeId);
  const [audioExists, setAudioExists] = useState<boolean | null>(null);
  const [transcriptExists, setTranscriptExists] = useState<boolean | null>(null);
  const [sourceExists, setSourceExists] = useState<boolean | null>(null);
  const [analysisExists, setAnalysisExists] = useState<boolean | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playDuration, setPlayDuration] = useState(0);

  const getFileName = (id: number, type: 'transcript' | 'analysis') => {
    return `workbook-${id}-${type}.pdf`;
  };

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

      const updatePlayDuration = () => {
        setPlayDuration(prev => prev + 1);
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      const intervalId = setInterval(updatePlayDuration, 1000);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        clearInterval(intervalId);
      };
    }
  }, [episode, playDuration]);

  if (!episode) {
    return <div className="container mx-auto p-4 font-pt-serif">Episode not found</div>;
  }

  const prevEpisode = getSadlerWorkbooks().find(ep => ep.id === episodeId - 1);
  const nextEpisode = getSadlerWorkbooks().find(ep => ep.id === episodeId + 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{episode.title}</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Controls and Downloads */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Player */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              {audioExists !== null && (
                audioExists ? (
                  <audio 
                    ref={audioRef}
                    controls 
                    className="w-full" 
                    src={episode.audioUrl}
                    onPlay={() => console.log('Direct onPlay event')}
                    onPause={() => console.log('Direct onPause event')}
                  ></audio>
                ) : (
                  <p className="text-gray-500 font-medium">Audio coming soon...</p>
                )
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              {prevEpisode && (
                <Link 
                  href={`/sadler-workbooks/${prevEpisode.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </Link>
              )}
              {nextEpisode && (
                <Link 
                  href={`/sadler-workbooks/${nextEpisode.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Downloads Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Downloads</h2>
              <div className="space-y-3">
                {transcriptExists !== null && (
                  transcriptExists ? (
                    <a 
                      href={`/transcripts/sadler/${getFileName(episode.id, 'transcript')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-sky-50 rounded-lg transition-colors group"
                    >
                      <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="flex-1 text-gray-700 group-hover:text-gray-900">Download Podcast Transcript</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-gray-500 font-medium">Transcript coming soon...</p>
                  )
                )}

                {analysisExists !== null && (
                  analysisExists ? (
                    <a 
                      href={`/analysis/sadler/${getFileName(episode.id, 'analysis')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-sky-50 rounded-lg transition-colors group"
                    >
                      <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="flex-1 text-gray-700 group-hover:text-gray-900">Download Episode Analysis</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-gray-500 font-medium">Episode Analysis coming soon...</p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Source Material */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <span className="font-medium text-gray-700">Original Study Material</span>
                <div className="flex items-center gap-3">
                  <a 
                    href={episode.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  View the original study at{' '}
                  <a 
                    href={episode.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    UrantiaBookStudy.com
                  </a>
                </p>
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
