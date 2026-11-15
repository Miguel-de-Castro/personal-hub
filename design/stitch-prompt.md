# Stitch Prompt — Personal Hub App

## App Overview (paste first, as context)

Design a personal productivity app called "Personal Hub" — a minimalist, all-in-one life planner for a single user. It combines four areas: task management, a learning tracker, a job application pipeline, and a daily/weekly activity log, tied together by a dashboard that summarizes everything.

Style: clean, modern, calm — think shadcn/ui aesthetic. Neutral background (white/near-white in light mode, dark slate in dark mode), one accent color used sparingly for primary actions and status highlights, generous whitespace, rounded-corner cards, subtle borders instead of heavy shadows, clear typography hierarchy. Should feel like a focused productivity tool, not playful or cluttered — closer to Linear/Notion than a consumer app. Must work responsively as both a desktop web layout (sidebar navigation) and a mobile layout (bottom tab bar), since it will be used as a PWA.

Navigation: persistent sidebar on desktop / bottom tab bar on mobile with 5 destinations: Dashboard, Tasks, Learning, Jobs, Log.

---

## Screen 1 — Dashboard (Home)

Purpose: at-a-glance overview of the user's current state across all areas, the first thing they see when opening the app.

Contents:
- Header with greeting (e.g. "Good morning") and today's date.
- A row of summary stat cards: tasks due today, active learning topics in progress, open job applications, current log streak (days logged in a row).
- "Today's tasks" section: compact list of tasks due today with checkboxes, pulled from the Tasks area.
- "In progress" section: 2-3 learning topics currently being studied, shown as small cards with a progress indicator.
- "Recent job activity" section: last 2-3 job applications updated, showing company name and current stage as a status badge.
- "This week" mini summary: a small block showing how many days were logged this week and a one-line excerpt from the most recent log entry.
- All sections link through to their full screen.

---

## Screen 2 — Tasks

Purpose: manage a to-do list, optionally grouped by goal or context.

Contents:
- Top bar with a search input, a filter/sort control (by status, priority, due date), and an "Add task" button.
- Tasks displayed as a list of rows, each with: checkbox to mark complete, task title, optional due date badge, priority indicator (low/medium/high, color-coded), and an optional tag/category label (e.g. "Learning", "Job Search", "Personal").
- Tasks grouped into collapsible sections: "Overdue", "Today", "Upcoming", "No due date", "Completed" (collapsed by default).
- Clicking a task opens a side panel or modal with: title, description, due date picker, priority selector, tags, and a delete button.
- Empty state illustration/message when there are no tasks.

---

## Screen 3 — Learning

Purpose: track topics/skills the user wants to learn, with progress status.

Contents:
- Top bar with "Add topic" button and a filter by status (To Learn / In Progress / Completed).
- Topics displayed as a grid of cards, each showing: topic title, short description, status badge (To Learn / In Progress / Completed) with distinct colors, a progress bar or percentage, and optional resource links (e.g. course URL, book, docs) shown as small icons or chips.
- Clicking a card opens a detail view/modal with: full description, editable status, progress notes (free text log of what was studied), list of resource links with add/remove, and a delete button.
- Empty state for when no topics exist yet, encouraging the user to add their first one.

---

## Screen 4 — Jobs (Job Application Pipeline)

Purpose: track job applications through their lifecycle, kanban-style.

Contents:
- Top bar with "Add application" button and a search input.
- Kanban board layout with columns representing stages: "Wishlist", "Applied", "Interviewing", "Offer", "Rejected/Closed".
- Each application shown as a card in its column with: company name, role title, applied date, and a small logo/initial avatar placeholder.
- Cards can be dragged between columns to update status.
- Clicking a card opens a detail panel with: company name, role title, job posting URL, location, salary range (optional), notes/timeline (free text log of interview rounds, contacts), status dropdown, and a delete button.
- On mobile, the kanban collapses into a single-column list with a status filter/tab selector instead of horizontal scroll.

---

## Screen 5 — Log (Daily/Weekly Activity Log)

Purpose: journal what was done each day, and review it aggregated by week.

Contents:
- Toggle at the top between "Day" view and "Week" view.
- Day view: a date selector (prev/next day arrows + calendar picker), a text entry area for "What did I do today?", and a list of past entries below in reverse chronological order, each showing date and a preview of the text, expandable to full content.
- Week view: a 7-day grid or timeline showing which days have entries (filled dot) vs missing (empty dot), plus an auto-generated weekly summary section listing tasks completed, learning progress made, and job application activity during that week, aggregated from the other three areas.
- "Add entry" quick action always accessible (e.g. floating action button on mobile).

---

## Flow Summary

The user opens the app and lands on the **Dashboard**, which surfaces what needs attention today (tasks due, topics in progress, recent job activity, logging streak) and links out to each dedicated screen. From **Tasks**, they manage day-to-day to-dos, optionally tagging them by area (e.g. linking a task to a learning goal or job application). In **Learning**, they track topics with a status progression from "To Learn" to "In Progress" to "Completed," logging notes and resources along the way. In **Jobs**, they move applications through a kanban pipeline from "Wishlist" to a final outcome, keeping notes on each interaction. In **Log**, they close the loop by journaling daily activity, which the app aggregates into a weekly review — reinforcing the sense of progress across all three other areas. Navigation between all five screens is persistent (sidebar on desktop, bottom tabs on mobile), so the user can move fluidly between planning (Tasks), growth (Learning), career (Jobs), and reflection (Log), with the Dashboard always available as the central return point.
