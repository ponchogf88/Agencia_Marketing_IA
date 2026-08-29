# 🏛️ PROMPT AGENT — Multi-Agent Marketing Agency & Weekly Intelligence Pipeline

[![Architecture: 13 Autonomous Agents](https://img.shields.io/badge/Agents-13%20Specialists-00f0ff?style=flat-square)](#)
[![Orchestrator: n8n](https://img.shields.io/badge/Orchestrator-n8n%20v1.0-ff6d5a?style=flat-square)](#)
[![AI Engine: Google Gemini 3](https://img.shields.io/badge/AI%20Engine-Gemini%203%20Pro-4285f4?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=flat-square)](#)

> **Autonomous growth, intelligence, and content engine.** Combines **n8n Stateful Workflows**, **Google Gemini 3 Pro Reasoning Models**, **Notion DB & Obsidian Knowledge Bases**, and **Code-to-Video (HyperFrames)** to research, produce, and distribute commercial marketing assets on autopilot every Friday at 4:00 PM.

---

## ⚡ Quick Start (3 Steps)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/YOUR_USERNAME/prompt-agent-marketing-agency.git
cd prompt-agent-marketing-agency
cp .env.example .env
```
Add your **Google Gemini API Key** and optional Notion / Telegram keys inside `.env`.

### 2. Import Workflow into n8n
1. Open your **n8n Instance**.
2. Go to **Workflows** → Click `...` → **Import from File**.
3. Select `workflows/n8n_workflow_PROMPT_AGENT_v1.json` and click **Activate**.

### 3. Automatic Friday Execution
Every Friday at 4:00 PM, the system will:
1. Research 50+ official AI breakthroughs.
2. Filter the **Top 5** with scoring > 75/100.
3. Generate native content for **LinkedIn, X (Thread), Instagram, Facebook**, and a **60s Video Script**.
4. Pass through the **Editorial QA Gate** (Score > 90).
5. Sync with **Notion Database** and **Obsidian Vault**.
6. Send a **1-Click Approval Notification** to your Telegram/Slack.

---

## 👥 The 13 Specialized Subagents

| Subagent | Role | Core Responsibility |
| :--- | :--- | :--- |
| **Head of Marketing** | Chief Orchestrator | Dynamic graph routing, business intent, and quality clearance. |
| **Analyst** | Market & Tech Intel | Factual verification, buyer intent, and signal vs. noise analysis. |
| **SEO Lead** | Organic Growth | Search intent mapping, semantic topic clusters, and content gaps. |
| **Copywriter** | Conversion Copy | High-impact hooks, landing pages, VSLs, and A/B test matrices. |
| **Creative Strategist** | Visual Concepts | Campaign metaphor design, creative systems, and art direction. |
| **Media Buyer** | Paid Performance | Campaign structure (TOFU/MOFU/BOFU), pacing, and stop-loss limits. |
| **Email Marketer** | Lifecycle & CRM | Automated nurturing sequences, RFM segmentation, and deliverability. |
| **Social Media Manager** | Multi-Platform Distro | Native adaptations for IG, LinkedIn, X, FB, and TikTok. |
| **Launch Manager** | Operations & Timing | RACI matrices, readiness checklists, and dependencies. |
| **Pricing Strategist** | Monetization | Packaging, tier architecture, contribution margin, and LTV. |
| **Competitor Analyst** | Benchmarking (OSINT) | Competitive battlecards, moat analysis, and pricing gap tracking. |
| **ASO Specialist** | Mobile App Store | Store listing optimization, keyword research, and screenshot testing. |
| **Data Analyst** | Measurement | Event schemas, attribution models, and experiment validation. |
| **Editor & QA** | Brand Gatekeeper | Orthographic review, safe zones compliance, and publication sign-off. |

---

## 📂 Repository Structure

```text
├── workflows/
│   └── n8n_workflow_PROMPT_AGENT_v1.json    # Complete importable n8n pipeline
├── docs/
│   ├── PROMPT_AGENT_Master_Operating_Manual_v1.pdf  # Publication manual (PDF)
│   ├── PROMPT_AGENT_Master_Operating_Manual_v1.md   # Master manual (Markdown)
│   ├── PROMPT_AGENT_Execution_Plan_Infographic.pdf  # SpaceX/xAI style infographic
│   ├── Weekly_Intelligence_Live_Delivery_W35.md     # First live delivery run
│   ├── infografia_roadmap_xai.html                  # Interactive roadmap HUD
│   └── recursos_y_stack_form.html                   # 1-Click stack configurator
├── scripts/
│   └── render_video_hyperframes.js                  # Code-to-video programmatic engine
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🛡️ Security & Governance

- **Token Stop-Loss:** Hard budget cap circuit-breaker preventing infinite loops.
- **HMAC SHA-256 Signatures:** Timing-safe verification on all inbound webhooks.
- **Human-in-the-Loop (HITL):** Irreversible actions (ad spend, publishing) always require human approval.

---

## 📄 License
MIT © 2026 PROMPT AGENT & Marketing Systems.
