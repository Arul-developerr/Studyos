# Reference replication audit

This is a progress record, not a claim of pixel-identical completion. All 21 routes render. Desktop captures are in `qa/captures/`; `npm run qa` regenerates them at 1440 × 900. Route checks also run at 1280 × 800, 768 × 1024, and 390 × 844.

The supplied archive contains multiple alternate AI Agent and Digital Twin designs. The named assets in `public/reference` are the working mapping. Screenshots are used as references and cropped decorative artwork; pages and controls are React.

| Route | Reference | Result and remaining differences |
|---|---|---|
| `/` | `landing.png` | Existing reference layout retained; orbit artwork and lower sections differ. |
| `/signin` | `signin.png` | Existing reference layout retained; external authentication unavailable. |
| `/onboarding` | `onboarding.png` | Split layout and top stepper implemented; field count and illustration crop differ. |
| `/dashboard` | `dashboard.png` | Existing dedicated layout retained; local study data changes cards. |
| `/planner` | `E:/Hack (planner reference)` | Existing weekly layout and scheduling retained; calendar data differs. |
| `/agent` | `agent.png` | Two-column workspace implemented; deterministic optimizer differs from reference chat. |
| `/tasks` | `tasks.png` | Real task table and calendar sidebar implemented; quick capture and summary counts differ. |
| `/analytics` | `analytics.png` | Six-panel report arrangement implemented; task completion visualization differs. |
| `/progress` | `progress.png` | Subject table, streak, milestones and lower reports implemented; timeline and goals differ. |
| `/focus` | `focus.png` | Working timer over cropped landscape implemented; full desk scene and playlist/blocker absent. |
| `/knowledge` | `knowledge.png` | Interactive topic nodes and detail panel retained; true 3D scene and orbital composition absent. |
| `/memory` | `memory.png` | Review card, rating buttons, session panel and retention panels implemented; questions are recall prompts. |
| `/exam-readiness` | `exam.png` | Subject rings, topic performance and weak areas added; mock-test chart/history absent. |
| `/digital-twin` | `twin.png` | Profile/persona placed above simulation; career and illustrated forecast panels absent. |
| `/adaptation` | `adaptation.png` | Comparison, strategy builder and explanation columns implemented; projected-score graph absent. |
| `/agent-history` | `agent-history.png` | Existing dedicated layout retained; decision content depends on local records. |
| `/profile` | `profile.png` | Existing dedicated layout retained; illustration and local student details differ. |
| `/settings` | `settings.png` | Existing dedicated layout retained; unconnected services explicitly identified. |
| `/activity` | `activity.png` | Existing dedicated layout retained; activity content depends on local records. |
| `/achievements` | `achievements.png` | Featured badge cards, progress rings and journey/reward sidebar implemented; illustrated badges/landscape differ. |
| `/resources` | `resources.png` | Filters, feature tiles, resource covers and directory implemented; real public links differ from mock downloadable materials. |

## Verification

Production TypeScript/Vite build passes. Latest complete browser run: 87 checks, zero failures (21 routes at four widths, plus planner generation and profile/settings panels). These checks verify rendering, runtime errors, page overflow and selected actions; they do not certify visual equality or every interaction. The later onboarding spacing correction was checked separately.

## Preserved behavior

Task creation/editing/deletion/completion, local persistence, planner generation and drag/drop, timestamp focus timer, topic creation/selection, memory review ratings, exam creation, scenario proposals and accept/reject, profile/settings editing, and data export remain connected to browser-local state. Memory review updates the original interval/mastery fields. Resource links remain public external destinations.

## Visual acceptance

The stricter all-21 reference requirement is not yet satisfied. The largest remaining gaps are Agent chat, Knowledge 3D, Focus artwork, Exam mock-test panels, Digital Twin illustration panels, and exact resource/badge artwork. Route/build success must not be reported as proof that those gaps are complete.
