import React from 'react';
import { render, screen } from '../utils/test-utils';
import SeriesCard from '../../components/ui/SeriesCard';
import { SeriesInfo } from '../../utils/seriesUtils';
import '@testing-library/jest-dom'; // Import jest-dom for the matchers

// Mock series data
const mockJesusSeries: SeriesInfo = {
  id: 'life-and-teachings',
  title: 'Life and Teachings of Jesus',
  description: 'Explore the life and teachings of Jesus as presented in the Urantia Book',
  logline: 'An in-depth exploration of Jesus\' life on Earth',
  category: 'jesus-focused',
  imageSrc: '/images/jesus-series.jpg',
  totalEpisodes: 5,
  paperRange: '120-196'
};

const mockCosmicSeries: SeriesInfo = {
  id: 'central-universe',
  title: 'The Central Universe',
  description: 'Learn about the structure of the central universe',
  logline: 'Understanding Havona and Paradise',
  category: 'parts-i-iii',
  imageSrc: '/images/central-universe.jpg',
  totalEpisodes: 3,
  paperRange: '11-15'
};

describe('SeriesCard', () => {
  test('renders Jesus series card correctly', () => {
    render(<SeriesCard series={mockJesusSeries} />);
    
    // Check if title is displayed
    expect(screen.getByText('Life and Teachings of Jesus')).toBeInTheDocument();
    
    // Check if logline is displayed
    expect(screen.getByText('An in-depth exploration of Jesus\' life on Earth')).toBeInTheDocument();
    
    // Check if badge text is correct
    expect(screen.getByText('Jesus Series')).toBeInTheDocument();
    
    // Check if link points to correct URL
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/series/life-and-teachings');
  });
  
  test('renders Cosmic series card correctly', () => {
    render(<SeriesCard series={mockCosmicSeries} />);
    
    // Check if title is displayed
    expect(screen.getByText('The Central Universe')).toBeInTheDocument();
    
    // Check if logline is displayed
    expect(screen.getByText('Understanding Havona and Paradise')).toBeInTheDocument();
    
    // Check if badge text is correct
    expect(screen.getByText('Cosmic Series')).toBeInTheDocument();
    
    // Check if link points to correct URL
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/series/central-universe');
  });
  
  test('handles missing image gracefully', () => {
    const seriesWithoutImage = {
      ...mockJesusSeries,
      imageSrc: undefined as unknown as string // Type assertion to match interface while testing
    };
    
    render(<SeriesCard series={seriesWithoutImage} />);
    
    // Title should still be displayed
    expect(screen.getByText('Life and Teachings of Jesus')).toBeInTheDocument();
  });
}); 