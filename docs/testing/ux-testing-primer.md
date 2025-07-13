# UX Testing Primer for UBPod

## Overview

Automated browser-based UX testing ensures that your app's user experience works as intended across navigation, localization, and user flows. This primer introduces the main tools, setup, and best practices for testing the UBPod project.

---

## 1. Why Automated UX Testing?
- **Catches regressions** in navigation, routing, and UI behavior
- **Simulates real user actions** (clicks, typing, navigation)
- **Verifies localization** and language switching
- **Ensures accessibility and responsiveness**

---

## 2. Recommended Tools

### **Cypress**
- Easy to set up and use
- Great for end-to-end (E2E) and integration tests
- Interactive GUI for debugging
- [Cypress Docs](https://docs.cypress.io/)

### **Playwright**
- Powerful, supports multiple browsers (Chromium, Firefox, WebKit)
- Good for cross-browser automation
- [Playwright Docs](https://playwright.dev/)

---

## 3. Setup Instructions

### **A. Cypress**

1. **Install Cypress:**
   ```bash
   npm install --save-dev cypress
   ```
2. **Add script to `package.json`:**
   ```json
   "scripts": {
     "cypress:open": "cypress open"
   }
   ```
3. **Open Cypress UI:**
   ```bash
   npm run cypress:open
   ```
4. **Create a test file:**
   Place tests in `cypress/e2e/` (e.g., `cypress/e2e/urantia-papers-routing.cy.js`)

### **B. Playwright**

1. **Install Playwright:**
   ```bash
   npm install --save-dev @playwright/test
   npx playwright install
   ```
2. **Add script to `package.json`:**
   ```json
   "scripts": {
     "test:e2e": "playwright test"
   }
   ```
3. **Create a test file:**
   Place tests in `tests/` (e.g., `tests/urantia-papers-routing.spec.ts`)

---

## 4. Example Test: Urantia Papers Routing (Cypress)

```js
// cypress/e2e/urantia-papers-routing.cy.js
describe('Urantia Papers Series Card Routing', () => {
  it('routes correctly in English', () => {
    cy.visit('/series');
    cy.contains('Urantia Papers').click();
    cy.url().should('include', '/urantia-papers');
    cy.contains('LOS DOCUMENTOS DE URANTIA'); // Page heading
  });

  it('routes correctly in Spanish', () => {
    cy.visit('/es/series');
    cy.contains('Orígenes Cósmicos').click();
    cy.url().should('include', '/es/urantia-papers');
    cy.contains('LOS DOCUMENTOS DE URANTIA');
  });
});
```

---

## 5. Best Practices

- **Use data-testid attributes** for stable selectors (add to key buttons/links if needed)
- **Test both EN and ES** for all navigation and UI flows
- **Test edge cases:** direct URL entry, 404s, unavailable series
- **Keep tests isolated:** reset state between tests
- **Use CI integration** (e.g., GitHub Actions) to run tests on every PR

---

## 6. Useful Resources
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Playwright Test Examples](https://playwright.dev/docs/test-examples)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 7. Next Steps
- Add more tests for language switching, audio player, error states, and navigation
- Review test output after each run and fix any failing tests promptly
- Encourage all contributors to run tests before pushing changes

---

**Happy testing!** 