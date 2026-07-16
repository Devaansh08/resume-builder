# Resume Alchemist — Advanced Full-Stack AI Resume Builder & Architecture Documentation

[![GitHub Repository](https://img.shields.io/badge/GitHub-Devaansh08%2Fresume--builder-181717?style=for-the-badge&logo=github)](https://github.com/Devaansh08/resume-builder)

An enterprise-grade, highly customizable, full-stack resume builder featuring real-time ATS optimization, split-screen live previewing, multi-format file import (`.pdf`, `.docx`), dynamic PDF rendering, 3D interactive preview modes, and comprehensive undo/redo state management.


---

## 🏗 System Architecture Overview

The workspace (`c:\ResumeBuilder`) is architected as a clean full-stack monorepo with dedicated `frontend` and `backend` services communicating over REST API proxies.

```
+-------------------------------------------------------------------------------+
|                              CLIENT BROWSER                                   |
|   +-----------------------------------------------------------------------+   |
|   |  Frontend App (React 19 + TypeScript + Vite + Zustand State Store)    |   |
|   |  - Split-Screen Editor & Live Multi-Page Preview                      |   |
|   |  - Real-time ATS Parsing Engine (`scoreResume`)                       |   |
|   |  - Client-Side Document Import (`mammoth`, `pdfjs-dist`)              |   |
|   |  - Client-Side PDF Renderer (`jspdf` + `html2canvas`)                 |   |
|   +-----------------------------------+-+---------------------------------+   |
+---------------------------------------|---------------------------------------+
                                        | (Vite Proxy: /api -> :3001)
                                        v
+-------------------------------------------------------------------------------+
|                           BACKEND API SERVICE                                 |
|   +-----------------------------------------------------------------------+   |
|   |  Node.js + Express 4 + TypeScript (`tsx watch` / `tsc`)               |   |
|   |  - Helmet Security & CORS Policies (`cross-origin` protection)        |   |
|   |  - Rate Limiting (`authLimiter`, `globalLimiter`)                     |   |
|   |  - Express Session (`resumeai.sid` cookie-based auth state)           |   |
|   |  - Firebase Admin SDK Integration (Auth & User Data Management)       |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```

---

## 📁 Repository Directory Structure

```text
c:\ResumeBuilder\
├── frontend/                                # Frontend Single Page Application
│   ├── package.json                         # Dependencies & Vite build scripts
│   ├── vite.config.ts                       # Vite server, port 5173, /api proxying
│   ├── index.html                           # Root HTML entry point
│   ├── public/                              # Static public assets & fonts
│   └── src/
│       ├── main.tsx                         # React 19 root bootstrap
│       ├── App.tsx                          # Route definitions & app providers
│       ├── types/
│       │   └── index.ts                     # Core domain interfaces (Resume, Section, Theme, etc.)
│       ├── store/
│       │   └── resumeStore.ts               # Zustand store with persisted history snapshots & undo/redo
│       ├── utils/
│       │   ├── ats.ts                       # Real-time ATS heuristic scoring engine
│       │   ├── pdf.ts                       # Multi-page PDF generation (jspdf & html2canvas)
│       │   └── helpers.ts                   # Debouncing, UUID generation, date formatting
│       ├── pages/
│       │   ├── Landing.tsx                  # Hero showcase, sample loader, interactive demo cards
│       │   ├── Builder.tsx                  # Main split-screen resume workspace & keyboard listeners
│       │   ├── Templates.tsx                # Template gallery & switcher
│       │   └── FullPreview.tsx              # Fullscreen resume presentation mode
│       └── components/
│           ├── builder/                     # Core builder UI widgets
│           │   ├── BuilderNavbar.tsx        # Top toolbar with title rename, Undo/Redo, mock data loader
│           │   ├── SectionSidebar.tsx       # Draggable section navigation & reordering
│           │   ├── EditorPanel.tsx          # Dynamic form fields & section editors
│           │   ├── PreviewPanel.tsx         # Live multi-page rendering & zoom controller
│           │   ├── ATSPanel.tsx             # Real-time ATS scoring breakdown & improvement tips
│           │   ├── ImportModal.tsx          # PDF & Word file import parser interface
│           │   └── RichTextToolbar.tsx      # Markdown / rich text formatting controls
│           ├── sections/                    # Individual section form components (Experience, Education, etc.)
│           └── templates/                   # 8 Distinct professional resume rendering engines
│               ├── ModernTemplate.tsx       # Modern 2-column sidebar design
│               ├── MinimalTemplate.tsx      # Clean single-column typographic layout
│               ├── ProfessionalTemplate.tsx # Classic conservative corporate formatting
│               ├── CreativeTemplate.tsx     # Vibrant design with accent shapes
│               ├── ExecutiveTemplate.tsx    # High-density C-level leadership layout
│               ├── IndianAcademicTemplate.tsx # Academic & research focused (Publications, CGPA)
│               ├── IndianCorporateTemplate.tsx # SDE/Corporate layout with dense bullet points
│               └── ShrineTemplate.tsx       # Editorial magazine-style bold presentation
│
└── backend/                                 # Node.js + Express REST API
    ├── package.json                         # Backend scripts (dev, build, start) & dependencies
    ├── tsconfig.json                        # TypeScript server compiler configuration
    ├── .env                                 # Environment variables (PORT, SESSION_SECRET, CLIENT_URL)
    └── src/
        ├── index.ts                         # Express server setup, middlewares, rate limiters & session
        └── routes/
            ├── auth.ts                      # Authentication endpoints (/api/auth)
            ├── resume.ts                    # Resume storage & sync endpoints (/api/resume)
            ├── export.ts                    # Server-side export handling (/api/export)
            └── share.ts                     # Public resume sharing & links (/api/share)
```

---

## 🧠 State Management & History Architecture (`resumeStore.ts`)

The frontend application uses **Zustand** (`useResumeStore`) with devtools and middleware persistence (`sessionStorage` for active UI states and debounced `localStorage` (`resumeai_saved_resumes`) for persistent document storage).

### Key Store Features:
1. **History Snapshots & Undo/Redo (`pushSnapshot`)**:
   Every structural modification (`updateSections`, `updateSection`, `updateSectionTitle`, `updateTemplate`, `updateTheme`, `setSectionOrder`, `updateResumeTitle`, `loadSampleResume`) pushes a serialized snapshot to the `history` array (capped at 30 entries).
   - **Undo (`Ctrl+Z` / `Cmd+Z`)**: Restores the state from `history[historyIndex - 1]`.
   - **Redo (`Ctrl+Y` / `Cmd+Shift+Z`)**: Advances the state to `history[historyIndex + 1]`.
2. **Debounced Local Auto-Save (`debouncedSave`)**:
   All state updates invoke a 1000ms debounced save action writing to local storage without freezing the UI thread or blocking re-renders.
3. **Mock & Sample Data Loader (`loadSampleResume`)**:
   Provides 5 instant sample profiles with authentic data (`software`, `product`, `finance`, `fresher`, `blank`) without polluting sample templates across user sessions.

### Core Domain Models (`Resume`):
```typescript
export interface Resume {
  id: string;
  userId: string;
  title: string;
  template: TemplateId;
  theme: ResumeTheme;
  sections: ResumeSections;
  sectionOrder: string[];
  sectionTitles: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🎨 Available Resume Templates (`TemplateId`)

| Template ID | Name | Best For | Architecture & Layout Features |
| :--- | :--- | :--- | :--- |
| `modern` | **Modern Sidebar** | Tech & Startups | 2-column layout with personal details on the left, experience on the right. |
| `minimal` | **Clean Minimal** | Design & Architecture | Single-column, generous white space, strong typographic hierarchy. |
| `professional`| **Traditional Professional** | Law, Banking, Traditional | Conservative header, horizontal rule dividers, formal spacing. |
| `creative` | **Creative Accent** | Marketing & Media | Bold accent banners, customized skill pills, dynamic visual balance. |
| `executive` | **Executive Leadership** | C-Level, Directors, VPs | High-density presentation, key metrics highlight boxes, extensive experience. |
| `indianAcademic`| **Indian Academic** | Researchers, B.Tech/M.Tech | Dedicated sections for CGPA/Percentage, publications, rank/gate scores. |
| `indianCorporate`| **Indian Corporate** | SDEs, IT Professionals | Dense bullet architecture optimized for technical keyword scanning. |
| `shrine` | **Editorial Shrine** | Editorials & Portfolios | Bold magazine-style header, distinctive typography, editorial spacing. |

---

## ⚡ Real-Time ATS Scoring Engine (`utils/ats.ts`)

The client-side heuristic engine calculates a live **ATS Compatibility Score (0–100%)** triggered via a 500ms debounced listener whenever sections change (`scoreResume`).

### Heuristic Scoring Criteria:
1. **Personal Information Completeness**: Checks presence of email, phone, location, LinkedIn/GitHub profiles, and professional summary.
2. **Experience & Action Verbs**: Scans for measurable impact numbers (`%`, `$`, `increased`, `reduced`, `architected`) and standard industry action verbs inside bullet points.
3. **Skills & Keyword Density**: Evaluates skill categories against standard industry keywords (`React`, `TypeScript`, `Node`, `Python`, `AWS`, `Docker`, `SQL`, etc.).
4. **Formatting Check**: Verifies that bullet point lengths are optimal and free from unparseable special characters or nested tables.

---

## 🚀 Local Development & Setup Instructions

### Prerequisites
- **Node.js** (`v18.x` or `v20.x` recommended)
- **npm** (`v9.x+`)

### 1. Start the Backend API Server
The backend server runs on port **3001** and handles authentication, sessions, and data syncing.
```bash
cd backend
npm install
npm run dev
```
*Server runs at `http://localhost:3001/` with CORS enabled for `http://localhost:5173`.*

### 2. Start the Frontend Development Server
Open a new terminal window to start the Vite frontend dev server on port **5173**.
```bash
cd frontend
npm install
npm run dev
```
*App is accessible at `http://localhost:5173/`. API calls targeting `/api/*` are automatically proxied to `http://localhost:3001`.*

### 3. Production Build & Verification
To verify TypeScript compilation and build the production bundle:
```bash
cd frontend
npm run build
```
*(This executes `tsc -b && vite build` and places optimized static assets inside `frontend/dist/`).*

---

## 🛠 Key Commands & Scripts Summary

| Command | Working Directory | Description |
| :--- | :--- | :--- |
| `npm run dev` | `c:\ResumeBuilder\frontend` | Start Vite dev server (`http://localhost:5173`). |
| `npm run build` | `c:\ResumeBuilder\frontend` | Run TypeScript type check & build production assets. |
| `npm run lint` | `c:\ResumeBuilder\frontend` | Run `oxlint` across all TypeScript/React source files. |
| `npm run dev` | `c:\ResumeBuilder\backend` | Start backend server in watch mode (`http://localhost:3001`). |
| `npm run build` | `c:\ResumeBuilder\backend` | Compile backend TypeScript (`tsc`) to `backend/dist/`. |
