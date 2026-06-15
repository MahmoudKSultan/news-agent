# Software Requirements Specification (SRS)

## AI-Powered News Intelligence Agent

**Version:** 1.0  
**Date:** 2026-06-15

---

## 1. Introduction

### 1.1 Purpose
This document defines the software requirements for an AI-powered News Intelligence Agent that autonomously gathers, summarizes, analyzes, translates, and delivers news articles and YouTube content on a user-defined schedule, with a feedback-driven learning system.

### 1.2 Scope
The system is a web-based application that:
- Scrapes/retrieves news from RSS feeds, websites, search engines, and YouTube
- Summarizes and analyzes content via local/open LLMs
- Translates content on demand
- Learns user preferences via ratings and implicit signals
- Delivers results as a structured website and email notifications
- Operates on a recurring schedule (hourly, daily, weekly, custom)

### 1.3 Definitions
- **Agent:** The core logic that orchestrates fetching → processing → delivery
- **Run/Session:** One complete cycle of the agent
- **Source:** Any content provider (RSS feed, website URL, YouTube channel)
- **Article:** A single piece of content (news article, blog post, video transcript)
- **Profile:** Per-user learned preferences (sources, styles, topics)

---

## 2. Overall Description

### 2.1 User Classes
| Class | Description |
|---|---|
| **End User** | Consumes news, rates content, sets preferences, receives notifications |
| **Admin** | Manages sources, monitors system health, views logs (future) |

### 2.2 Operating Environment
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API routes / Server Actions, optional Python microservices
- **Database:** SQLite (dev), PostgreSQL (prod future)
- **LLM:** Ollama (local) / Gemini API free tier
- **Translation:** LibreTranslate (self-hosted) / argos-translate
- **Hosting:** GitHub Pages (static output) or Render/Fly.io free tier
- **Scheduler:** APScheduler / cron

### 2.3 Design & Implementation Constraints
- All tools must be free-tier or self-hosted (no paid APIs)
- LLM calls should be local via Ollama when possible
- User data stored locally, no external data sharing
- Must respect robots.txt and rate limits on scraped sources

---

## 3. Functional Requirements

### FR-01: Source Management
| ID | Requirement | Priority |
|---|---|---|
| FR-01.1 | User can add/remove RSS feed URLs | P0 |
| FR-01.2 | User can add/remove YouTube channels or video URLs | P0 |
| FR-01.3 | User can add/remove websites for scraping | P1 |
| FR-01.4 | User can enable/disable individual sources | P0 |
| FR-01.5 | System validates source URLs before adding | P0 |

### FR-02: Content Fetching
| ID | Requirement | Priority |
|---|---|---|
| FR-02.1 | System fetches RSS feeds and parses articles | P0 |
| FR-02.2 | System fetches YouTube subtitles via transcript API | P0 |
| FR-02.3 | System scrapes web articles (with politeness delays) | P1 |
| FR-02.4 | System searches DuckDuckGo for supplementary content | P1 |
| FR-02.5 | System deduplicates near-identical articles | P1 |
| FR-02.6 | System respects source rate limits | P0 |

### FR-03: Summarization & Analysis
| ID | Requirement | Priority |
|---|---|---|
| FR-03.1 | System generates short summary (1 paragraph) per article | P0 |
| FR-03.2 | System generates detailed summary with key points | P0 |
| FR-03.3 | System extracts key entities (people, orgs, locations) | P1 |
| FR-03.4 | System detects sentiment (positive/negative/neutral) | P1 |
| FR-03.5 | System categorizes articles by topic | P1 |
| FR-03.6 | System generates different analysis angles (financial, technical, etc.) | P2 |

### FR-04: Translation
| ID | Requirement | Priority |
|---|---|---|
| FR-04.1 | User can set a preferred language | P0 |
| FR-04.2 | System translates article content to user's preferred language | P0 |
| FR-04.3 | System detects source language automatically | P1 |
| FR-04.4 | User can request translation per-article | P1 |
| FR-04.5 | Translated content is cached to avoid re-translation | P1 |

### FR-05: Scheduling
| ID | Requirement | Priority |
|---|---|---|
| FR-05.1 | User can set recurring schedule (hourly, daily, weekly) | P0 |
| FR-05.2 | User can set custom cron expression | P1 |
| FR-05.3 | User can trigger a manual run at any time | P0 |
| FR-05.4 | System shows next scheduled run time | P1 |

### FR-06: Notifications
| ID | Requirement | Priority |
|---|---|---|
| FR-06.1 | System sends email digest after each run | P0 |
| FR-06.2 | Email includes summary links and top articles | P0 |
| FR-06.3 | User can configure notification frequency | P1 |
| FR-06.4 | Optional: push notifications via ntfy.sh | P2 |
| FR-06.5 | Optional: Telegram/Discord webhook delivery | P2 |

### FR-07: User Interface (Website)
| ID | Requirement | Priority |
|---|---|---|
| FR-07.1 | Dashboard shows latest run results | P0 |
| FR-07.2 | Each article shows title, source, summary, rating | P0 |
| FR-07.3 | User can click to view full article & analysis | P0 |
| FR-07.4 | User can filter by category, source, date | P1 |
| FR-07.5 | User can search across articles | P1 |
| FR-07.6 | Responsive design (mobile + desktop) | P0 |

### FR-08: Folder/File Output
| ID | Requirement | Priority |
|---|---|---|
| FR-08.1 | Each run generates a dated output folder | P0 |
| FR-08.2 | Folder contains individual article files (Markdown) | P0 |
| FR-08.3 | Folder contains a summary index file | P1 |
| FR-08.4 | Folder structure is navigable via static HTML | P1 |

### FR-09: Rating & Learning
| ID | Requirement | Priority |
|---|---|---|
| FR-09.1 | User can rate each article 1-5 stars | P0 |
| FR-09.2 | System tracks source-specific avg rating per user | P0 |
| FR-09.3 | System tracks style/depth/angle preference per user | P1 |
| FR-09.4 | If rating < 3, system retries with different params | P1 |
| FR-09.5 | System deprioritizes low-rated sources | P1 |
| FR-09.6 | System records implicit signals (read time, clicked details) | P2 |
| FR-09.7 | System maintains per-user preference profile | P0 |

### FR-10: Agent Decision Loop
| ID | Requirement | Priority |
|---|---|---|
| FR-10.1 | Agent can modify summarization style based on feedback | P1 |
| FR-10.2 | Agent can change analysis angle on retry | P1 |
| FR-10.3 | Agent can fetch additional sources on low rating | P2 |
| FR-10.4 | Agent logs what it tried and why | P1 |

---

## 4. Non-Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-01 | System must work fully offline (except web fetching) | P1 |
| NFR-02 | Page load time under 2s on modern browsers | P0 |
| NFR-03 | LLM response time under 10s per article | P1 |
| NFR-04 | System should handle 20+ sources per run | P0 |
| NFR-05 | No API keys required for core functionality | P0 |
| NFR-06 | All user data stored locally, not sent to third parties | P0 |
| NFR-07 | Source code should be modular and testable | P1 |
| NFR-08 | TypeScript strict mode enabled | P0 |

---

## 5. Data Model

### 5.1 User
| Field | Type | Notes |
|---|---|---|
| id | UUID | PK |
| email | string | for notifications |
| name | string | |
| preferred_lang | string | e.g. "ar", "en" |
| schedule | string | cron expression |
| timezone | string | |
| created_at | timestamp | |

### 5.2 SourcePreference
| Field | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK→user |
| source_name | string | e.g. "BBC", "TechCrunch" |
| source_type | enum | "rss", "youtube", "web" |
| url | string | |
| weight | float | 0.0–1.0 |
| avg_rating | float | learned |
| times_rated | int | |
| is_active | bool | |
| unique(user_id, source_name) | | |

### 5.3 Article
| Field | Type | Notes |
|---|---|---|
| id | UUID | PK |
| source | string | |
| url | string | unique |
| title | string | |
| raw_text | text | |
| translated_text | text | nullable |
| source_lang | string | |
| target_lang | string | |
| summary_short | text | |
| summary_detailed | text | |
| analysis_json | jsonb | sentiment, entities, topics |
| category | string | |
| fetched_at | timestamp | |
| published_at | timestamp | |

### 5.4 ArticleInteraction
| Field | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK→user |
| article_id | UUID | FK→article |
| rating | int | 1-5 |
| session_id | UUID | groups a batch |
| read_time_sec | int | implicit |
| clicked_details | bool | |
| created_at | timestamp | |

### 5.5 Session
| Field | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | |
| started_at | timestamp | |
| completed_at | timestamp | |
| article_count | int | |
| avg_rating | float | |

### 5.6 AgentLog
| Field | Type | Notes |
|---|---|---|
| id | UUID | PK |
| session_id | UUID | |
| article_id | UUID | nullable |
| action | string | what agent tried |
| params | jsonb | parameters used |
| rating_before | int | nullable |
| rating_after | int | nullable |
| created_at | timestamp | |

---

## 6. System Architecture (MVP)

```
┌─────────────────────────────────────────────┐
│            Next.js App (Website)             │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │ Dashboard│ │ Articles │ │ Settings     │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│            Next.js API / Server Actions       │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │ Fetch    │ │ Analyze  │ │ Translate   │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│              Agent Core (Python or TS)        │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │ Scheduler│ │ Learning │ │ Notifier    │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
└───────┬──────────────┬──────────────┬────────┘
        │              │              │
┌───────▼──────┐ ┌─────▼─────┐ ┌─────▼──────┐
│  Ollama/Gemini│ │  SQLite   │ │ File System │
│  (LLM)       │ │  (DB)     │ │ (Output)   │
└──────────────┘ └───────────┘ └────────────┘
```

---

## 7. Glossary

| Term | Definition |
|---|---|
| Agent | Orchestration logic that runs the fetch → process → deliver cycle |
| Article | A piece of content (news, blog, video transcript) |
| Run/Session | One complete agent cycle |
| Source | An RSS feed, website URL, or YouTube channel |
| Profile | Per-user learned preferences |
| LLM | Large Language Model (Ollama or Gemini) |
