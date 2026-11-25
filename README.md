# SkillBridge — Frontend (Phase 1 & 2)

A React + Vite + Tailwind CSS frontend prototype for SkillBridge.

## Included
- Responsive landing page with project explanation and career-path overview
- Student registration form with basic validation
- Local browser persistence for the registered student profile
- Responsive dashboard shell with collapsible desktop sidebar and mobile drawer
- Working React Router navigation for all planned sections
- Dashboard with realistic sample data, charts and roadmap preview
- Career explorer with the eight initial career paths

## Requirements
- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm

## Run locally
1. Extract this project folder.
2. Open the folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually http://localhost:5173).

## Production build check

```bash
npm run build
```

## Demo flow
1. Open `/` for the landing page.
2. Click **Start your journey**.
3. Complete the registration form and submit.
4. You will land on the dashboard with your entered profile.
5. Use the sidebar to navigate between dashboard sections.
6. Refresh the browser: the profile remains saved in localStorage.

## Important prototype notes
- Authentication is not implemented. Registration is a local demo profile, not a secure account system.
- The dashboard includes clearly illustrative sample metrics. They are not calculated from real assessment results yet.
- Assessment, rule-based gap analysis, dynamic roadmap generation, Skill Passport and progress persistence are planned for later phases.
- No backend is connected in this phase. The frontend is ready for API integration in a later phase.
