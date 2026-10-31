# NEXUS 14-day demo dataset

The demo covers October 17–30, 2026 in Asia/Kolkata. It is fictional and uses stable record IDs. Fresh browsers open the demo automatically. Existing personal workspaces remain active until **Settings → Data & Privacy → Load 14-Day Demo Data** is selected. **Reset Demo Data** confirms before replacing only demo records. **Return to Personal Workspace** restores the saved personal workspace.

Personal data uses `nexus-studyos-v1`. Demo data uses `nexus-studyos-demo-v1`; the active selection uses `nexus-studyos-mode`. Reset does not erase personal storage. All application routes use the active DataProvider dataset. No layouts or routes were redesigned for this task.

## Validated totals

| October date | Completed hours |
|---|---:|
| 17 | 2 |
| 18 | 3 |
| 19 | 2.5 |
| 20 | 3.5 |
| 21 | 1.5 |
| 22 | 3 |
| 23 | 0.5 |
| 24 | 4 |
| 25 | 2.5 |
| 26 | 3 |
| 27 | 2 |
| 28 | 3.5 |
| 29 | 2.5 |
| 30 | 1 |
| Total | 34.5 |

24 completed sessions contribute 2070 minutes. Five missed/incomplete sessions contribute no completed minutes. Three additional future plan sessions represent the last accepted agent proposal and are not included in completed hours.

| Subject | Completed hours | Topic mastery | Calculated quiz accuracy |
|---|---:|---:|---:|
| DSA | 10 | 68% | 72% |
| DBMS | 9 | 81% | 84% |
| Web Technology | 8 | 85% | 88% |
| Aptitude | 7.5 | 55% | 61% |

Each quiz has 50 questions, allowing the exact requested scores with integer correct/incorrect counts. Subject accuracy is total correct divided by total questions. DBMS averages 82% and 86% to 84%; Aptitude averages 48% and 74% to 61%. Overall accuracy is 225/300 = 75%. Mastery is the average of four topic estimates, not quiz accuracy. `quizAccuracy` is the shared calculation helper; no new quiz UI was added.

20 tasks include 10 completed tasks plus pending and in-progress work. Open tasks include overdue dates and future deadlines. The DBMS assignment was created October 27 and is due November 4. Two exams are scheduled November 9 and 12. Twelve revision records update matching topic review dates, counts and intervals using the existing Good/Hard/Easy interval rules. Retention remains an estimate and changes with elapsed time; quiz score 0 on a revision means no prior attempt was recorded.

Seven agent events include two accepted proposals, one rejection, one pending recommendation and three completed observations. The final accepted snapshot exactly equals the live future plan. Rejected and pending snapshots do not alter it. Two achievement records correspond to the implemented five-session and ten-review milestones.

`npm run qa:seed` verifies totals, IDs, references, exact quiz arithmetic, agent statuses, applied snapshots, schedule conflicts, 14 activity dates, deterministic seed generation, all 21 routes, refresh persistence and personal-data preservation. `npm run build` verifies production compilation. Live charts retain their existing date filters, so seven-day views show only the relevant portion of this fixed historical period.
