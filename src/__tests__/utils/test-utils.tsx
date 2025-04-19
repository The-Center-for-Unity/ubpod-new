import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Custom renderer that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { route?: string }
) => {
  const { route = '/' } = options || {};
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[route]}>
        {children}
      </MemoryRouter>
    ),
    ...options
  });
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// This is just to make Jest happy - tests are in test-utils.test.tsx
if (process.env.NODE_ENV === 'test') {
  describe('Test utils placeholder', () => {
    it('should satisfy Jest\'s requirement for at least one test', () => {
      expect(true).toBe(true);
    });
  });
} 