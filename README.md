# ResumeAI - Free ATS-Friendly Resume Builder

ResumeAI is a modern, fast, and completely free ATS-friendly resume builder. It allows users to build highly-optimized, professional resumes in under 10 minutes with a real-time preview, interactive editors, customizable templates, and PDF export.

---

## 🚀 Key Features

- **⚡ Real-time Side-by-Side Preview**: Modify your resume details and see updates instantly without page refreshes.
- **📈 ATS Optimization & Scoring**: Integrated ATS feedback system that analyzes formatting, keyword density, active verbs, and identifies missing sections to score your resume.
- **✨ Multiple Templates**: Choose from beautiful, professionally designed templates (Modern, Minimal, Professional, and Shrine templates).
- **🔄 Drag-and-Drop Reordering**: Easily rearrange sections like Experience, Projects, Skills, and Education.
- **🔒 Secure Authentication**: Powered by Firebase Auth with secure session management via Express-Session/Cookies on the backend.
- **💾 Auto-Save**: Automatic draft saving so you never lose progress.
- **📄 High-Quality PDF Export**: Print or export your resume to PDF in A4 or Letter format with zero watermarks.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Form Handling & Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **PDF Export**: jsPDF + html2canvas / react-to-print

### Backend
- **Framework**: Node.js + Express (TypeScript)
- **Authentication**: Firebase Admin SDK
- **Security**: Helmet, Express Rate Limit, Cors
- **Sessions**: Express Session + Cookie Parser

---

## 📁 Project Structure

```text
ResumeBuilder/
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── middleware/       # Authentication & security middleware
│   │   ├── routes/           # Auth, resume management, sharing, and export routes
│   │   ├── services/         # Firebase integration
│   │   └── index.ts          # Server entry point
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                 # Vite + React client application
│   ├── src/
│   │   ├── assets/           # Images and static assets
│   │   ├── components/       # UI components (builder panel, sections, template engine)
│   │   ├── features/         # Auth contexts and protected routing
│   │   ├── pages/            # View pages (Landing, Dashboard, Builder, Login, Profile)
│   │   ├── services/         # API & Firebase configurations
│   │   ├── store/            # Zustand global stores (resumeStore)
│   │   ├── types/            # TypeScript models
│   │   └── utils/            # ATS tools, PDF export handlers, and defaults
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md                 # Main workspace documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Duplicate the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide the required values:
   - `PORT`: Server port (e.g., `5000`)
   - `SESSION_SECRET`: Secret key for session hashing
   - Firebase service account keys (see `.env.example` for format)

4. Run the development server:
   ```bash
   npm run dev
   ```

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Duplicate the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide the required Firebase configuration values (API keys, project IDs, etc.).

4. Run the frontend development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

---

## 📄 License

This project is licensed under the MIT License.
