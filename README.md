# SmartFare Tracker — SerpAPI Google Flights (branch: feature/serpapi-google-flights)

This branch documents the SerpAPI Google Flights real-fare search path for routes such as EZE → YWG.

Notes:
- This branch is experimental and focused exclusively on SerpAPI Google Flights.
- Do NOT replace `main` with this workflow; `main` remains the stable academic MVP using mock data.

What this branch includes:
- `workflows/smartfare-tracker-serpapi-wip.sanitized.json` — sanitized n8n export (no keys/secrets).
- `docs/serpapi-google-flights-plan.md` — SerpAPI-specific plan and parameters.
- `docs/repository-architecture.md` — overall branch and roadmap architecture.
- Updated `.env.example` with SerpAPI placeholders only.

Usage:
- Configure SerpAPI credentials in n8n or local `.env` (do not commit secrets).
- Import the sanitized workflow into n8n and wire credentials locally.
# SmartFare Tracker n8n

n8n automation for monitoring flight prices, logging results in Google Sheets, and sending Telegram alerts when a flight matches a cheap-flight rule.

## Stack

- n8n
- Docker + WSL2
- Code node with JavaScript
- Google Sheets
- Telegram Bot API
- Google OAuth2

## Current MVP

- Runs automatically every 1 hour.
- Uses a mock flight provider to generate simulated flight prices.
- Records all results in Google Sheets.
- Sends Telegram alerts only for cheap flights.
- Uses a decoupled architecture so real APIs can be integrated later.
- Stable `main` stays in mock mode for academic delivery.

## Real API Integration - WIP

- The current stable MVP stays in mock mode for academic delivery and portfolio clarity.
- The experimental branch will replace the mock Code Node with an HTTP Request Node.
- The goal is to connect a real flight API without changing the Google Sheets and Telegram downstream flow.
- Secrets, API keys and provider credentials must stay outside the repository.

## Recorded Fields

| Field | Description |
| --- | --- |
| Timestamp | Execution time |
| Origin | Departure airport |
| Destination | Arrival airport |
| Airline | Airline name |
| Price | Flight price |
| Alert_type | Record classification |

## Required Credentials

Configure these inside n8n:

- Telegram bot token
- Google Sheets OAuth2 credentials

Do not commit tokens or secrets to the repository.

## Architecture

```text
Schedule Trigger
      ↓
Code Node (JavaScript) - mock provider
      ↓
Simulated Flight Provider
   ├── Google Sheets historical log
   └── IF price < threshold
         └── Telegram alert
```

## Workflow Preview

![n8n workflow](screenshots/n8n-workflow.png)
