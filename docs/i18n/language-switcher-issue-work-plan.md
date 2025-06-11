## **🔍 Language Switcher Issue Analysis**

You've identified a critical synchronization problem between the URL-based language detection and the language switcher state. Let me break down what's happening:

### **🐛 Current Issues**

**1. Language Detection Failure**
- Direct navigation to `/es/` doesn't update the language context
- Page stays in English despite Spanish URL
- Language switcher UI still shows "EN"

**2. Double Language Prefix Bug** 
- Clicking Spanish when already on `/es/` results in `/es/es`
- URL generation isn't replacing existing language prefix

**3. State Synchronization Problem**
- URL and language context are out of sync
- Language switcher doesn't reflect actual URL language

### **🔎 Root Cause Analysis**

Based on the symptoms, I suspect these architectural issues:

**1. Language Context Initialization**
```typescript
// Likely issue: LanguageContext doesn't read from URL on initial load
// It probably defaults to 'en' regardless of URL
const [language, setLanguage] = useState('en'); // ❌ Hard-coded default
```

**2. URL Language Detection Timing**
```typescript
// Possible issue: Language detection happens after component render
// Or the detection function isn't being called on route changes
useEffect(() => {
  // This might not be running or running too late
  const urlLang = getLanguageFromPath(location.pathname);
  setLanguage(urlLang);
}, []); // ❌ Missing location.pathname dependency
```

**3. Language Switching Logic**
```typescript
// Likely issue: Language switching doesn't handle existing prefixes
const switchLanguage = (newLang) => {
  // ❌ This probably just appends instead of replacing
  navigate(`/${newLang}${location.pathname}`);
};
```

**4. Route Configuration**
```typescript
// Possible issue: Routes might not be properly handling /es/
<Route path="/es" element={<HomePage />} />        // ✅ This exists
<Route path="/es/*" element={<HomePage />} />      // ❌ This might be missing
```

### **📋 Fix Plan (Analysis Only)**

**Phase 1: Language Context Fixes**
1. **URL-First Initialization**: Language context should initialize from URL, not default to 'en'
2. **Route Change Listening**: Context should update when URL changes (React Router location changes)
3. **Proper Dependency Arrays**: useEffect hooks should watch for location.pathname changes

**Phase 2: Language Switcher Logic**
1. **Current Language Detection**: Switcher should get current language from context, not maintain its own state
2. **URL Replacement Logic**: When switching languages, replace existing prefix instead of appending
3. **Edge Case Handling**: Handle switching from default language (no prefix) to prefixed language

**Phase 3: Routing Improvements**
1. **Catch-All Routes**: Ensure `/es/*` routes catch all sub-paths
2. **Default Language Handling**: Proper handling of no-prefix (English) routes
3. **Navigation Guards**: Prevent invalid language combinations in URLs

**Phase 4: State Synchronization**
1. **Single Source of Truth**: URL should be the authoritative source for language
2. **Reactive Updates**: All components should react to language context changes
3. **Initialization Order**: Ensure language is detected before components render translations

### **🎯 Expected Behavior After Fix**

**Scenario 1: Direct URL Access**
- User navigates to `http://localhost:5173/es/`
- Language context detects "es" from URL
- Page renders in Spanish
- Language switcher shows "ES" as active

**Scenario 2: Language Switching**
- User on `/es/` clicks English switcher
- URL becomes `http://localhost:5173/` (removes prefix)
- Page renders in English
- User on `/` clicks Spanish switcher  
- URL becomes `http://localhost:5173/es/`

**Scenario 3: Deep Link Consistency**
- User navigates to `http://localhost:5173/es/episode/1`
- Page renders in Spanish
- All navigation maintains `/es/` prefix
- Language switcher correctly shows "ES"

### **🔧 Files Likely Needing Updates**

1. **`src/i18n/LanguageContext.tsx`** - Core language state management
2. **`src/i18n/LanguageSwitcher.tsx`** - Switcher component logic  
3. **`src/utils/i18nRouteUtils.ts`** - URL manipulation utilities
4. **`src/App.tsx`** - Route configuration and navigation handling

### **⚠️ Critical Considerations**

1. **Browser Back/Forward**: Fix should handle browser navigation correctly
2. **Initial Page Load**: Language must be detected before any components render
3. **Fallback Behavior**: Invalid language codes should redirect to default
4. **SEO Impact**: URL structure changes shouldn't break existing links

Would you like me to proceed with implementing these fixes step by step?