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
- Experimental branch `feature/real-flight-api` contains a working Aviationstack integration.
- The real API workflow is WIP and should not replace the stable delivery yet.

## Real API Integration - WIP

- The current stable MVP stays in mock mode for academic delivery and portfolio clarity.
- The experimental branch will replace the mock Code Node with an HTTP Request Node.
- The goal is to connect a real flight API without changing the Google Sheets and Telegram downstream flow.
- Secrets, API keys and provider credentials must stay outside the repository.
- Validated Aviationstack flow is documented in the experimental branch, but the mock MVP remains the portfolio baseline.

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
