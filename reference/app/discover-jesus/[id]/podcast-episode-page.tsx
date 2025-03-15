import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PodcastEpisodePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Navigation Bar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/podcast-logo.svg" alt="Urantia Book Podcast" className="h-8 w-8" />
            <span className="text-xl font-semibold text-sky-600">Urantia Book Podcast</span>
          </div>
          <div className="flex gap-4">
            <select className="bg-transparent border-none text-sky-600 font-medium">
              <option>Series</option>
            </select>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
              Pay It Forward
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Image and Navigation */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 lg:hidden">
              Jesus Personalized Indwelling Spirit
            </h1>
            
            <div className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/episode-image.jpg" 
                alt="Spiritual Light"
                className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <a 
                    href="https://discoverjesus.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-white/90 hover:bg-white text-sky-900 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors"
                  >
                    Visit DiscoverJesus.com →
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div className="hidden lg:block">
              <h1 className="text-4xl font-bold text-gray-900">
                Jesus Personalized Indwelling Spirit
              </h1>
            </div>

            {/* Audio Player */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors">
                  ▶
                </button>
                <div className="flex-1">
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div className="w-1/3 h-full bg-sky-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>0:00</span>
                    <span>12:07</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Learn More Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Learn More</h2>
              <div className="space-y-3">
                <a href="#" className="block text-sky-600 hover:text-sky-700 transition-colors">
                  Read the Full Article →
                </a>
                <a href="#" className="block text-sky-600 hover:text-sky-700 transition-colors">
                  View Timeline →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="text-sm">
            This podcast content was generated by Notebook1.1, using The Urantia Papers as the sole source material.
            <br />
            The audio narration is AI-generated and may not perfectly reflect human intonation or pronunciation.
          </p>
          <p className="text-sm">
            © 2024 The Center for Unity. All rights reserved.
          </p>
          <p className="text-sm">
            Urantia Book Podcast is a project by{' '}
            <a href="#" className="text-sky-400 hover:text-sky-300 transition-colors">
              The Center for Unity
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PodcastEpisodePage;
