# ✏️ ResumeAI — Free ATS Resume Builder

<div align="center">

**Build a job-winning, ATS-optimized resume in minutes. No account. No watermarks. 100% free.**

[🚀 Launch App](resume-builder-o7po.vercel.app) · [📋 Templates](https://resume-builder.vercel.app/templates) · [🐛 Report Bug](#)

![ResumeAI Preview](https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=500&fit=crop&q=80)

</div>

---

## ✨ What is ResumeAI?

ResumeAI is a modern, blazing-fast resume builder with a **Marginalia notebook aesthetic** — cream paper backgrounds, red margin accents, and clean ink typography. It helps job seekers create professional, ATS-optimized resumes with real-time preview and instant PDF export.

**No sign-in required. No data sent to servers. Everything stays in your browser.**

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| ⚡ **Live Preview** | Real-time side-by-side editor + resume preview |
| 📈 **ATS Scoring** | Instant feedback on formatting, keywords, and structure |
| 📄 **Upload Parser** | Drop in your old PDF/DOCX and auto-fill your editor |
| 🎨 **10 Templates** | Modern, Executive, Creative, Harvard, Minimal, Shrine + more |
| ✍️ **MS Word Toolbar** | Bold, Italic, Bullet lists, Indent, Quick Phrases, Word count |
| 📥 **PDF Export** | Print-perfect A4/Letter PDF, zero watermarks, free forever |
| 🔒 **Total Privacy** | localStorage only — your data never leaves your device |
| 🌐 **Vercel Ready** | One-click frontend deploy to Vercel |

---

## 🎨 Design System — Marginalia Notebook Theme

Inspired by the aesthetic of classic academic notebooks:

- **Paper** `#F5F0E8` — Cream page background
- **Margin Red** `#C41E3A` — Primary accent, CTAs, decorative margin line
- **Ink Navy** `#1A1A3E` — Headings, primary text
- **Rule Blue** `#B8D4E8` — Ruled line separators
- **Fonts:** Inter (body), Plus Jakarta Sans (display), Caveat (handwriting accents)

---

## 🛠 Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 + TypeScript | Core UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS v3 | Styling (Marginalia design system) |
| Zustand + persist | State management + localStorage |
| @dnd-kit | Drag & drop section reordering |
| Lucide React | Icon system |
| jsPDF + html2canvas | Client-side PDF export |

### Backend (Optional)
| Tool | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Firebase Admin SDK | Authentication & Firestore |
| Helmet + Rate Limit | Security middleware |
| Express Session | Cookie-based sessions |

> The frontend works 100% without the backend. The backend is optional for Firebase sync.

---

## 📁 Project Structure

```text
ResumeBuilder/
├── backend/                   # Optional Express REST API
│   ├── src/
│   │   ├── middleware/        # Auth & security middleware
│   │   ├── routes/            # resume, auth, export routes
│   │   ├── services/          # Firebase Admin integration
│   │   └── index.ts           # Server entry point
│   └── package.json
│
├── frontend/                  # Vite + React client application
│   ├── src/
│   │   ├── components/
│   │   │   ├── builder/       # Builder panel, navbar, ATS, PDF tools
│   │   │   ├── sections/      # Form editors (PersonalInfo, Experience…)
│   │   │   ├── templates/     # Resume template components (10 total)
│   │   │   └── layout/        # Footer
│   │   ├── pages/             # Landing, Builder, Templates, Dashboard
│   │   ├── store/             # Zustand global state
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # ATS scorer, PDF, defaults, file parser
│   ├── vercel.json            # Vercel SPA routing config
│   ├── tailwind.config.js     # Marginalia design system
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

---

### 🖥️ Frontend (Required)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment (copy and update)
cp .env.example .env
# Fill in your Firebase config values

# 4. Start dev server
npm run dev
# → Opens at http://localhost:5173
```

---

### ⚙️ Backend (Optional)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies  
npm install

# 3. Configure environment
cp .env.example .env
# Fill in Firebase Admin SDK credentials + SESSION_SECRET

# 4. Start dev server
npm run dev
# → API at http://localhost:3001
```

---

## 🌍 Deploy to Vercel (Frontend Only)

The frontend is a fully self-contained SPA — **no backend required for Vercel**.

### Option A: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# In the frontend directory
cd frontend

# Build
npm run build

# Deploy
vercel --prod
```

### Option B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Add your environment variables from `frontend/.env`
4. Click **Deploy**

The `vercel.json` file is already configured for SPA routing.

---



## 🧩 Resume Templates

| ID | Name | Style |
|---|---|---|
| `modern` | Modern | 2-Column with accent sidebar |
| `professional` | Professional | Classic serif, single column |
| `minimal` | Minimal | Clean open whitespace |
| `google` | Google Style | ATS-optimized clean layout |
| `harvard` | Harvard | Centered academic header |
| `executive` | Executive | Bold navy centered header |
| `creative` | Creative | Colored sidebar bold layout |
| `microsoft` | Microsoft | Corporate professional |
| `shrine` | Shrine | Material Design warmth |
| `stanford` | Stanford | Classic academic centered |

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">
Built with ☕ + ✏️ | &copy; 2025 ResumeAI
</div>
