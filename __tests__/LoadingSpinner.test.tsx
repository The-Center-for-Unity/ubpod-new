import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../src/components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders correctly', () => {
    render(<LoadingSpinner />);
    
    // Check if the spinner is in the document
    const spinnerElement = document.querySelector('.animate-spin');
    expect(spinnerElement).toBeInTheDocument();
    
    // Check if it has the expected classes
    expect(spinnerElement).toHaveClass('border-4');
    expect(spinnerElement).toHaveClass('border-primary');
    expect(spinnerElement).toHaveClass('border-t-transparent');
  });
}); 