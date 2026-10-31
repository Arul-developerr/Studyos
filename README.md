# NEXUS StudyOS

A browser-local academic planning demo built with React, TypeScript, and Vite.

## Run

```bash
npm install
npm run dev
npm run build
npm run qa
```

The app has 21 routes. `/signin` offers local demo entry; use the Demo Mode tab or Enter Demo Mode button; email and password sign-in is not connected. Records are saved in this browser's `localStorage` under `nexus-studyos-v1`; Settings can export them as JSON.

The interface follows the supplied `Hack.zip` PNG references. All routes now have reference-specific layout work, including report grids, task tables, review cards, onboarding, and the dark sidebar on achievements/resources. See REFERENCE_AUDIT.md for the remaining differences. Reference artwork is in `public/reference/`.

## What is implemented

- Shared student, subject, topic, task, exam, session, revision, activity, and agent-decision records.
- Seven-day deterministic scheduling based on daily hours, session duration, breaks, topic mastery, imminent exams, and high-priority tasks. Overlapping sessions are rejected.
- Task review, creation, editing, filtering, completion, and deletion.
- Timestamp-based focus timer; completed sessions feed dashboard, analytics, progress, activity, and achievements.
- Topic review queue and deterministic spaced repetition ratings.
- Exam readiness estimate from topic mastery and review coverage.
- Agent and adaptation proposals with accept/reject history and plan restore.
- Digital twin what-if estimates with visible assumptions.
- Responsive navigation, light/dark appearance, local data export.

## Honest limits

The initial academic records are explicitly demo seed data. There is no backend, account sync, email authentication, LLM, quiz capture, 3D scene, or external notification service. The knowledge map is 2D. The digital twin is an illustrative formula, not a grade predictor. The design replication is close to the supplied screenshots but is not pixel-identical on every route; browser data and viewport size also change the displayed content. `Hack.zip` contained PNG design references, while a separate original project exists at `D:\-Arul-\Hack` and was not copied into this workspace.

`npm run qa` runs browser checks for route loading, page errors, horizontal overflow at desktop and mobile sizes, and selected planner/profile/settings interactions. Install Playwright Chromium first if it is not already available.

## Routes

`/`, `/signin`, `/onboarding`, `/dashboard`, `/planner`, `/agent`, `/tasks`, `/analytics`, `/progress`, `/focus`, `/knowledge`, `/memory`, `/exam-readiness`, `/digital-twin`, `/adaptation`, `/agent-history`, `/profile`, `/settings`, `/activity`, `/achievements`, `/resources`.


## Personal learning

Open `/learn` or choose Learning Hub in the sidebar. Select **Start Personal Learning**, then **Choose This Syllabus**. An existing personal workspace is restored; first-time learners start without fictional academic records. Enrolling adds the four foundation subjects without deleting existing subjects or work.

The general B.Tech IT foundation includes 16 lessons (four each in DSA, DBMS, Web Technology, and Aptitude), worked examples, 16 checked practice exercises, and 32 original multiple-choice questions with answer explanations. It is a foundation syllabus, not a complete university degree curriculum. Lesson records and notes, practice completions, quiz attempts/answers, mastery, review tasks, reading sessions, and activity events use the shared local dataset. Completed reading time is recorded from observed visible-page seconds rather than the advertised lesson duration. Marking completion is idempotent; users can retake a quiz as a new attempt.

Interactive labs include insertion-sort tracing, a sample SELECT filter explorer (not a general SQL engine), sandboxed HTML/CSS preview (JavaScript and network requests disabled), and a percentage calculator. Flashcards use lesson questions and answers in the Memory Engine; ratings update both topic review schedules and revision history. Global search includes lesson titles. Learning links are available from Dashboard, Resources, Knowledge, and the study assistant tabs.

Lesson explanations are original concise teaching material with further-study links to [MIT OpenCourseWare](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [PostgreSQL](https://www.postgresql.org/docs/current/tutorial.html), [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development), [React](https://react.dev/learn), and [OpenStax](https://openstax.org/books/elementary-algebra-2e/pages/3-2-solve-percent-applications).

Progress stays on the current browser/device; use Settings export for backups. There is no cloud account sync, live AI tutor, or arbitrary code execution service. Run `npm run qa:learning` for learning-flow, persistence, grading, lab, and responsive checks.


## Local Qwen3 study chat

The AI Agent route (`/agent`) opens its Chat tab by default. It uses the locally installed **qwen3:0.6b** model through [Ollama’s streaming chat API](https://docs.ollama.com/api/chat). Open Ollama on the same laptop; if needed, run `ollama serve`. Install the model with `ollama pull qwen3:0.6b` only if the model-status badge reports it missing.

Vite development and preview servers proxy exactly `/api/ollama/tags` and `/api/ollama/chat` to `http://127.0.0.1:11434`. No cloud API key or global Ollama CORS change is required. Restart the dev server after adding the Vite configuration if it has not restarted automatically. Static hosting alone does not provide this proxy: a deployed app needs its own suitable backend/local bridge. The local model must run on the same machine as this app server.

Chat streams replies and supports Enter to send, Shift+Enter for new lines, cancellation, retrying the last question, copying answers, connection checks, and confirmed history clearing. Conversation histories persist separately for demo and personal workspaces under `nexus-ai-chat-demo-v1` and `nexus-ai-chat-personal-v1`. Switching a workspace or tab stops an active reply. The last 80 messages are stored; only the most recent bounded context is sent to the model. Matched syllabus lesson text is supplied as reference context where available. Student profile, grades, private notes, and files are not automatically included.

The model generates text only and cannot alter study schedules or records. Plan Optimizer remains available as a separate tab with its existing accept/reject workflow. Model answers may be inaccurate, especially with this small model. The UI identifies the local model and explains this limitation. Arbitrary model HTML is never rendered.

`npm run qa:chat` checks a live local-model answer, stream rendering, refresh persistence, stop/retry, connection failure/recovery, confirmed clearing, planner availability, and mobile overflow. Ollama and qwen3:0.6b must be running for this test.


## Qwen token dashboard

Open `/model-usage` or **Qwen Usage** in the sidebar. The chart icon in AI Chat also opens this separate dashboard. New chat attempts record their status independently of chat history. Clearing or retrying a conversation does not erase earlier usage attempts.

Input tokens come directly from Ollama's `prompt_eval_count` and output tokens from `eval_count` in the final stream record. Input counts include the system instructions and conversation history submitted on each request. Durations are converted from nanoseconds to milliseconds; generation speed is output tokens divided by generation seconds. The aggregate speed uses total output tokens divided by total generation time, not an unweighted average of per-request speeds.

Totals and daily stacked bars use only records with reported counts. Failed or stopped requests without final metrics display an em dash and are excluded from token totals; their actual consumption is unknown. A pending record left after a browser interruption is labeled pending/interrupted. The configured 4,096-token context and 768-token reply limits are displayed separately from actual usage.

The dashboard supports Today/7-day/30-day/All Time and status filters, per-request history, filtered JSON export, and confirmed usage clearing. Dates and day groupings use Asia/Kolkata. Demo and personal ledgers use separate `nexus-qwen-usage-demo-v1` and `nexus-qwen-usage-personal-v1` keys. Prompt and answer text are not copied into the usage ledger. Same-browser tab updates refresh the dashboard. The ledger measures this browser's NEXUS requests, not all Ollama activity on the laptop. Older replies cannot be backfilled because earlier builds did not save the final metrics.

`npm run qa:model-usage` compares saved counts with the raw final record from a live local Qwen reply and checks duration conversion, persistence, filters, exports, missing counts, safe usage clearing, and four viewport widths. `npm run qa:chat` also verifies complete/stopped/failed usage statuses while testing the existing chat controls.
