import React from 'react';
import { ChevronLeft, ChevronRight, Download, FileText, BookOpen, LineChart } from 'lucide-react';

const UrantiaEpisodePage = () => {
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
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Paper 1: The Universal Father
        </h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Controls and Downloads */}
          <div className="lg:col-span-2 space-y-6">
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
                    <span>17:29</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Downloads Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Downloads</h2>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 p-3 hover:bg-sky-50 rounded-lg transition-colors group">
                  <FileText className="w-5 h-5 text-sky-600" />
                  <span className="flex-1 text-gray-700 group-hover:text-gray-900">Download Podcast Transcript</span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-sky-600" />
                </a>
                <a href="#" className="flex items-center gap-3 p-3 hover:bg-sky-50 rounded-lg transition-colors group">
                  <BookOpen className="w-5 h-5 text-sky-600" />
                  <span className="flex-1 text-gray-700 group-hover:text-gray-900">Download Source Material (Urantia Paper)</span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-sky-600" />
                </a>
                <a href="#" className="flex items-center gap-3 p-3 hover:bg-sky-50 rounded-lg transition-colors group">
                  <LineChart className="w-5 h-5 text-sky-600" />
                  <span className="flex-1 text-gray-700 group-hover:text-gray-900">Download Episode Analysis</span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-sky-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - PDF Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <span className="font-medium text-gray-700">The Urantia Book</span>
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="aspect-[4/3] bg-gray-100">
                <iframe
                  src="/paper-1.pdf"
                  className="w-full h-full"
                  title="The Urantia Book - Paper 1"
                />
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

export default UrantiaEpisodePage;
