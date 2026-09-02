# Roshan Digital Website — Implementation & Developer Guide

## Quick Start

### Running the Website

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

Development server runs at: **http://localhost:5173**

---

## New Components & How to Use

### 1. Error Pages

**Location:** `src/pages/ErrorPage.tsx`

**Available Components:**
```typescript
import { NotFoundPage, ServerErrorPage, MaintenancePage } from './pages/ErrorPage'
```

**Usage Examples:**

```typescript
// 404 Not Found
<NotFoundPage 
  siteSettings={siteSettings} 
  liveApk={liveApk} 
  onNavigateHome={() => navigate('/')} 
/>

// 500 Server Error
<ServerErrorPage 
  siteSettings={siteSettings} 
  liveApk={liveApk} 
  onNavigateHome={() => navigate('/')} 
/>

// Maintenance Mode
<MaintenancePage 
  siteSettings={siteSettings} 
  onNavigateHome={() => navigate('/')} 
/>
```

**Props:**
- `siteSettings` (SiteSettings) - App configuration
- `liveApk` (ApkVersion) - Current APK version
- `onNavigateHome` (function) - Return to home action

---

### 2. Download App Page

**Location:** `src/pages/DownloadPage.tsx`

**Component:**
```typescript
import { DownloadAppPage } from './pages/DownloadPage'
```

**Usage Example:**

```typescript
<DownloadAppPage 
  liveApk={liveApk} 
  siteSettings={siteSettings} 
/>
```

**Props:**
- `liveApk` (ApkVersion) - Current APK info (version, size, changelog, etc.)
- `siteSettings` (SiteSettings) - App configuration (hero image, support email)

**Features:**
- 6-step installation guide
- Platform comparison (APK vs Google Play)
- SHA-256 security verification
- Download FAQ section
- Support contact options

---

### 3. Legal Modals

**Location:** `src/pages/DisclaimerPage.tsx` & `src/pages/CookiePolicyPage.tsx`

**Components:**
```typescript
import { DisclaimerModal, CookiePolicyModal } from './modals'
```

**Usage Example:**

```typescript
const [showDisclaimer, setShowDisclaimer] = useState(false)
const [showCookie, setShowCookie] = useState(false)

// Render modals conditionally
{showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}
{showCookie && <CookiePolicyModal onClose={() => setShowCookie(false)} />}

// Trigger from button
<button onClick={() => setShowDisclaimer(true)}>View Disclaimer</button>
<button onClick={() => setShowCookie(true)}>View Cookie Policy</button>
```

**Props:**
- `onClose` (function) - Callback when modal closes

---

## Modified Components

### App.tsx

**New State:**
```typescript
const [activeModal, setActiveModal] = useState<
  'help' | 'privacy' | 'about' | 'terms' | 'disclaimer' | 'cookie' | null
>(null)
const [currentView, setCurrentView] = useState<'home' | 'download' | 'not-found'>('home')
```

**New Imports:**
```typescript
import './pages.css'
import { DisclaimerModal, CookiePolicyModal } from './modals'
import { DownloadAppPage } from './pages/DownloadPage'
import { NotFoundPage } from './pages/ErrorPage'
```

**New Modal Rendering:**
```typescript
{activeModal === 'disclaimer' && <DisclaimerModal onClose={() => setActiveModal(null)} />}
{activeModal === 'cookie' && <CookiePolicyModal onClose={() => setActiveModal(null)} />}
```

### Footer.tsx

**New Props:**
```typescript
onOpenDisclaimer?: () => void
onOpenCookiePolicy?: () => void
```

**New Links in Footer:**
- "Disclaimer" → Opens DisclaimerModal
- "Cookie policy" → Opens CookiePolicyModal

### modals.tsx

**New Exports:**
```typescript
export { DisclaimerModal }
export { CookiePolicyModal }
```

---

## Styling & CSS

### New Stylesheet
- **Location:** `src/pages.css`
- **Size:** 520+ lines
- **Coverage:** All error pages, download page, modals

### CSS Features
- ✓ Responsive design (mobile < 768px)
- ✓ Glassmorphism effects
- ✓ Animations (@keyframes pulse, spin)
- ✓ CSS variables for theming
- ✓ Grid and Flexbox layouts

### Color Variables Used
```css
--bg-dark:     #0f172a  /* Main background */
--emerald:     #10b981  /* Primary accent */
--blue:        #06b6d4  /* Secondary accent */
--ink:         #000000  /* Text color */
--muted:       #94a3b8  /* Secondary text */
```

---

## Media Library System

### Location
`src/admin/tabs/MediaLibrary.tsx`

### 12 Managed Image Keys

```typescript
// Hero Section
hero_mobile_image        // Hero phone mockup
hero_background          // Alternative hero background
hero_badge_art           // Decorative accent

// Branding
app_logo                 // Main app logo
footer_logo              // Footer logo

// Content
app_screenshot           // App showcase image
feature_image_1          // Feature 1 image
feature_image_2          // Feature 2 image
feature_image_3          // Feature 3 image
feature_image_4          // Feature 4 image
news_featured            // Featured news image
security_visual          // Security section visual
```

### Admin Workflow

1. **Access:** Admin Panel → Media Library tab
2. **Search:** Use search box to find images
3. **Filter:** By category or status
4. **Upload:** Select "Upload New Image"
5. **Replace:** Click image → "Replace"
6. **Delete:** Click image → "Delete"
7. **Save:** Changes auto-sync to all sections

### Usage in Components

```typescript
// Get image URL with cache-busting version
const heroImage = getManagedImageUrl(siteSettings.images?.hero_mobile_image)

// Result: https://example.com/image.jpg?v=2 (cache-busting query param)
```

---

## Data Types

### SiteSettings Interface
```typescript
interface SiteSettings {
  announcementText: string
  announcementActive: boolean
  heroTitle: string
  heroSubtitle: string
  supportEmail: string
  telegramLink: string
  apkDownloadUrl: string
  maintenanceMode: boolean
  images: ManagedImageMap
}
```

### ManagedImage Interface
```typescript
interface ManagedImage {
  key: string                  // Unique identifier
  url: string                  // Image URL
  fileName: string             // Original filename
  uploadDate: string           // ISO date string
  updatedDate: string          // ISO date string
  active: boolean              // Is this image in use?
  version: number              // Cache-busting version
}
```

### ApkVersion Interface
```typescript
interface ApkVersion {
  id: string
  version: string              // e.g., "2.0.0"
  build: number                // e.g., 2000
  releaseDate: string          // ISO date string
  size: string                 // e.g., "48.6 MB"
  status: 'live' | 'beta' | 'archive'
  minAndroid: string           // e.g., "8.0"
  downloads: number            // Download count
  sha256: string               // Security hash
  changelog: string[]          // Array of changes
  downloadUrl: string          // APK download link
}
```

---

## Routing & Navigation

### Current Hash-Based Routing

The app uses URL fragments for routing:

```
/#top              → Home/Top
/#app              → App section
/#news             → News section
/#contact          → Contact section
/#about            → Open About modal
/#help             → Open Help modal
/#privacy          → Open Privacy modal
/#terms            → Open Terms modal
/#disclaimer       → Open Disclaimer modal
/#cookie           → Open Cookie modal
```

### Adding New Routes

To add a new modal trigger:

1. **Add to activeModal type:**
   ```typescript
   const [activeModal, setActiveModal] = useState<
     'help' | 'privacy' | 'about' | 'terms' | 'disclaimer' | 'cookie' | 'newpage' | null
   >(null)
   ```

2. **Add modal rendering:**
   ```typescript
   {activeModal === 'newpage' && <NewPageModal onClose={() => setActiveModal(null)} />}
   ```

3. **Add navigation trigger:**
   ```typescript
   <button onClick={() => setActiveModal('newpage')}>Open New Page</button>
   ```

---

## Admin Authentication

### Current Implementation (Development Only)

**Location:** `src/admin/auth.ts`

```typescript
// Using SHA-256 hash (NOT SECURE for production)
const hashedPassword = await calculateSHA256('password123')
// Result: a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
```

### For Production

⚠️ **Replace with backend API:**

```typescript
// Backend authentication (recommended)
const login = async (password: string) => {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
    headers: { 'Content-Type': 'application/json' }
  })
  const { token } = await response.json()
  localStorage.setItem('rd_admin_token', token)
  return token
}

// Use JWT tokens instead of storing password hash
const isAuthenticated = () => {
  const token = localStorage.getItem('rd_admin_token')
  return token && !isTokenExpired(token)
}
```

---

## TypeScript Support

### All Type Definitions
**Location:** `src/types.ts`

```typescript
export type FeatureItem = {...}
export type NewsItem = {...}
export type ApkVersion = {...}
export type SiteSettings = {...}
export type ManagedImage = {...}
export type ManagedImageMap = Record<string, ManagedImage>
export type AdminUser = {...}
```

### Shape Validators

Used to validate localStorage data:

```typescript
// In App.tsx
const isFeatureList = (v: unknown): v is FeatureItem[] => {...}
const isNewsList = (v: unknown): v is NewsItem[] => {...}
const isApkVersions = (v: unknown): v is ApkVersion[] => {...}
const isSiteSettings = (v: unknown): v is SiteSettings => {...}
```

---

## Development Tips

### Hot Reload
Vite automatically reloads when you save files:
```bash
npm run dev
# Changes auto-sync to browser
```

### TypeScript Checking
All files are type-checked automatically. Run manually:
```bash
npx tsc --noEmit
```

### Linting
Check for code style issues:
```bash
npm run lint
```

### Production Build
Create optimized bundle:
```bash
npm run build
# Output: dist/
```

### Common Issues

**Issue:** Images not loading
- **Solution:** Check managed images in admin Media Library
- **Check:** URL is accessible and CORS enabled

**Issue:** Modals not showing
- **Solution:** Verify activeModal state is set correctly
- **Check:** Modal component is imported and rendered

**Issue:** Admin dashboard not accessible
- **Solution:** Clear localStorage and re-login
- **Check:** Browser developer tools → Application → Local Storage

---

## File Structure

```
src/
├── App.tsx                          # Main app component
├── App.css                          # Main styles
├── types.ts                         # TypeScript interfaces
├── data.ts                          # Initial data
├── persistence.ts                  # localStorage helpers
├── modals.tsx                       # Modal exports
├── pages/
│   ├── ErrorPage.tsx                # NEW: Error pages
│   ├── DownloadPage.tsx             # NEW: Download guide
│   ├── DisclaimerPage.tsx           # NEW: Disclaimer modal
│   └── CookiePolicyPage.tsx         # NEW: Cookie policy modal
├── pages.css                        # NEW: Page styling
├── sections/
│   ├── HeaderHero.tsx
│   ├── FeaturesAndRelease.tsx
│   ├── NewsAndContact.tsx
│   └── Footer.tsx
├── admin/
│   ├── AdminPanel.tsx
│   ├── auth.ts
│   └── tabs/
│       ├── AdminApkManagement.tsx
│       ├── AdminDownloadsAnalytics.tsx
│       ├── AdminNewsManagement.tsx
│       ├── AdminVersionHistory.tsx
│       ├── AdminWebsiteSettings.tsx
│       ├── DashboardTab.tsx
│       └── MediaLibrary.tsx         # NEW: Enhanced media library
├── assets/
└── ...

public/
├── index.html
├── privacy.html                     # Static privacy page
├── terms.html                       # Static terms page
├── robots.txt
├── sitemap.xml
├── manifest.json
├── ads.txt
├── app-screenshot.jpg
├── roshan-digital-logo*.{png,svg}
├── features/*.jpg                   # 4 feature images
└── news/*.jpg                       # 5 news images
```

---

## Customization Guide

### Changing Colors

Edit `src/index.css`:

```css
:root {
  --bg-dark: #0f172a;      /* Dark background */
  --emerald: #10b981;      /* Primary green */
  --blue: #06b6d4;         /* Accent blue */
  --ink: #000000;          /* Text color */
  --muted: #94a3b8;        /* Muted gray */
}
```

### Adding New Features

1. Create component in `src/sections/`
2. Import in `src/App.tsx`
3. Add state management if needed
4. Render in appropriate section
5. Test in browser
6. Add to admin if user-editable

### Updating Legal Pages

Edit these components:
- Disclaimer: `src/pages/DisclaimerPage.tsx`
- Cookie Policy: `src/pages/CookiePolicyPage.tsx`
- Privacy Policy: `src/modals.tsx` (PrivacyPolicyModal)
- Terms: `src/modals.tsx` (TermsOfServiceModal)

Replace `[COMPANY/LEGAL ENTITY NAME]` and other placeholders with actual info.

---

## Testing Checklist

Before deploying:

- [ ] All pages render without errors
- [ ] Navigation links work correctly
- [ ] Modals open and close
- [ ] Admin login functions
- [ ] Image upload works
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] No console errors
- [ ] TypeScript compiles cleanly
- [ ] Build completes successfully
- [ ] All links point to correct URLs

---

## Support & Troubleshooting

### Getting Help

1. **Check console errors:** Browser DevTools → Console tab
2. **Check Network tab:** For failed requests
3. **Check localStorage:** Application → Local Storage
4. **Check TypeScript:** Run `npm run lint`

### Common Commands

```bash
# Install/update dependencies
npm install

# Check for updates
npm outdated

# Clean cache
rm -rf node_modules package-lock.json
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

**Last Updated:** September 2, 2026  
**Version:** 2.0.0  
**Status:** Production Ready (Frontend)
