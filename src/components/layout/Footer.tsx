import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-12 bg-navy-light/30 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <span className="title-subtitle text-sm tracking-[0.15em]">
                Urantia Book Podcast
              </span>
            </Link>
            <p className="body-lg text-white/70">
              AI-crafted audio companions for exploring cosmic truth
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="title-subtitle text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/urantia-papers" className="body-lg text-white/70 hover:text-white/90 transition-colors">
                  The Urantia Papers
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="body-lg text-white/70 hover:text-white/90 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* External Links */}
          <div className="space-y-4">
            <h3 className="title-subtitle text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.urantia.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="body-lg text-white/70 hover:text-white/90 transition-colors"
                >
                  Urantia Foundation
                </a>
              </li>
              <li>
                <a 
                  href="https://www.thecenterforunity.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="body-lg text-white/70 hover:text-white/90 transition-colors"
                >
                  The Center for Unity
                </a>
              </li>
              <li>
                <a 
                  href="https://www.thecenterforunity.org/contribute" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="body-lg text-white/70 hover:text-white/90 transition-colors"
                >
                  Pay It Forward
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Podcast Platforms */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <h3 className="title-subtitle text-lg font-semibold text-white mb-4">Also available on</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="https://www.youtube.com/playlist?list=PLgU-tjb05MakRB1XmcLKbshw5icSROylV" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label="YouTube"
            >
              <img 
                src="/images/platforms/youtube-button3.png" 
                alt="YouTube" 
                className="h-10 w-auto"
              />
            </a>
            <a 
              href="https://podcasts.apple.com/us/podcast/the-urantia-book-podcast/id1774930896" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label="Apple Podcasts"
            >
              <img 
                src="/images/platforms/apple-podcast-button.png" 
                alt="Apple Podcasts" 
                className="h-10 w-auto"
              />
            </a>
            <a 
              href="https://open.spotify.com/show/4CAEnHQh9MM2rKcxIvYn5V" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label="Spotify"
            >
              <img 
                src="/images/platforms/spotify-button.png" 
                alt="Spotify" 
                className="h-10 w-auto"
              />
            </a>
            <a 
              href="https://music.amazon.com/podcasts/9ab545ad-4fa8-4678-9704-631f745439fb/the-urantia-book-podcast" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label="Amazon Music"
            >
              <img 
                src="/images/platforms/amazon-music-button.png" 
                alt="Amazon Music" 
                className="h-10 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="body-lg text-white/50 text-sm">
            &copy; {new Date().getFullYear()} The Center for Unity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 