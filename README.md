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
- Generates simulated flight prices.
- Records all results in Google Sheets.
- Sends Telegram alerts only for cheap flights.
- Uses a decoupled architecture so real APIs can be integrated later.

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
Code Node (JavaScript)
      ↓
Simulated Flight Provider
   ├── Google Sheets historical log
   └── IF price < threshold
         └── Telegram alert