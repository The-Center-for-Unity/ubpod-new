import React, { useState } from 'react';
import { getMediaUrl } from '../utils/mediaUtils';
import { useTranslation } from 'react-i18next';

// Create a component to test the mediaUtils functionality
const MediaDebugger: React.FC = () => {
  const { t } = useTranslation('debug');
  const [seriesId, setSeriesId] = useState('urantia-papers');
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [fileType, setFileType] = useState<'mp3' | 'pdf'>('mp3');
  const [results, setResults] = useState<{ url: string | null, error: string | null }>({ url: null, error: null });

  const testUrl = () => {
    try {
      const url = getMediaUrl(seriesId, episodeNumber, fileType);
      setResults({ url, error: null });
      
      // If we have a URL, test it
      if (url) {
        fetch(url, { method: 'HEAD' })
          .then(response => {
            if (!response.ok) {
              setResults(prev => ({ ...prev, error: `URL returned ${response.status} ${response.statusText}` }));
            }
          })
          .catch(err => {
            setResults(prev => ({ ...prev, error: `Fetch error: ${err.message}` }));
          });
      }
    } catch (error) {
      setResults({ url: null, error: `Error: ${error instanceof Error ? error.message : String(error)}` });
    }
  };

  const seriesOptions = [
    'urantia-papers',
    'jesus-1', 'jesus-2', 'jesus-3', 'jesus-4', 'jesus-5',
    'jesus-6', 'jesus-7', 'jesus-8', 'jesus-9', 'jesus-10',
    'jesus-11', 'jesus-12', 'jesus-13', 'jesus-14',
    'cosmic-1', 'cosmic-2', 'cosmic-3', 'cosmic-4', 'cosmic-5',
    'cosmic-6', 'cosmic-7', 'cosmic-8', 'cosmic-9', 'cosmic-10',
    'cosmic-11', 'cosmic-12', 'cosmic-13', 'cosmic-14'
  ];

  return (
    <div className="min-h-screen bg-white text-black container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      
      <div className="mb-4">
        <label className="block mb-2 text-black">{t('fields.series')}</label>
        <select 
          className="border border-gray-300 p-2 w-full mb-2 text-black bg-white"
          value={seriesId} 
          onChange={e => setSeriesId(e.target.value)}
        >
          {seriesOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        
        <label className="block mb-2 text-black">{t('fields.episodeNumber')}</label>
        <input 
          type="number" 
          className="border border-gray-300 p-2 w-full mb-2 text-black bg-white"
          value={episodeNumber} 
          onChange={e => setEpisodeNumber(parseInt(e.target.value) || 0)} 
          min="0"
        />
        
        <label className="block mb-2 text-black">{t('fields.fileType')}</label>
        <select 
          className="border border-gray-300 p-2 w-full mb-4 text-black bg-white"
          value={fileType} 
          onChange={e => setFileType(e.target.value as 'mp3' | 'pdf')}
        >
          <option value="mp3">{t('fileTypes.mp3')}</option>
          <option value="pdf">{t('fileTypes.pdf')}</option>
        </select>
        
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={testUrl}
        >
          {t('fields.testButton')}
        </button>
      </div>
      
      {results.url && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="font-semibold mb-2">{t('results.generatedUrl')}</h2>
          <div className="break-all">
            <a href={results.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {results.url}
            </a>
          </div>
        </div>
      )}
      
      {results.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="font-semibold mb-2">{t('results.error')}</h2>
          <div className="text-red-500">{results.error}</div>
        </div>
      )}
    </div>
  );
};

export default MediaDebugger; 