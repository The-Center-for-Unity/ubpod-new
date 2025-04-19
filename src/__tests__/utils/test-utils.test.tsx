import React from 'react';
import { render, screen } from './test-utils';
import '@testing-library/jest-dom';

describe('Custom render function', () => {
  test('renders components with router context', () => {
    // Render a simple component with our custom render function
    render(<div data-testid="test-component">Test content</div>);
    
    // Verify it renders correctly
    const element = screen.getByTestId('test-component');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Test content');
  });
  
  test('supports custom initial route', () => {
    // Render with a specific route
    render(
      <div data-testid="route-test">Current route</div>,
      { route: '/test-route' }
    );
    
    // Verify component renders
    expect(screen.getByTestId('route-test')).toBeInTheDocument();
  });
}); 