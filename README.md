# SmartFare Tracker

[Español](README.es.md)

SmartFare Tracker is an n8n automation project that monitors flight fares, scores the results against user preferences, stores an auditable history in Google Sheets, and sends Telegram alerts when a fare matches the configured criteria.

The project combines Google Forms, Google Sheets, SerpAPI Google Flights, deterministic business scoring, Ollama, and Telegram. The LLM is used only to explain the decision; the alert decision itself is made by explicit scoring rules.

![n8n workflow](screenshots/workflow-architecture.png)

## Main Workflow

The main n8n export is:

`workflows/google-form-serpapi-ollama-google-flights.sanitized.json`

High-level flow:

```text
Google Forms response
-> Google Sheets config
-> n8n Schedule Trigger, every 6 hours
-> Get row(s) in sheet
-> Normalize Form Config
-> SerpAPI Google Flights
-> Normalize SerpAPI Response
-> Remove Duplicate Flights
-> Business Scoring
-> Append row in Google Sheets history
-> IF alert
-> Ollama explanation
-> Parse Ollama JSON
-> Telegram Alert
```

Google Forms acts as the simple input layer. Form responses are stored in Google Sheets, and n8n reads the sheet as the workflow configuration source.

## What It Does

- Reads flight search preferences from Google Sheets.
- Queries real flight data through SerpAPI Google Flights.
- Normalizes provider responses into consistent flight records.
- Removes duplicate flight options within the same execution.
- Applies deterministic scoring rules.
- Logs every evaluated result into Google Sheets.
- Uses Ollama with `qwen2.5:7b` to generate a short JSON explanation.
- Sends Telegram alerts for flights that meet the alert threshold.

## Input Configuration

The current Google Form / Google Sheets configuration expects fields like:

- `User Name`
- `Telegram Chat ID`
- `Origin Airport`
- `Destination Airport`
- `Outbound Date`
- `Maximum Price (USD)`
- `Maximum Stops`
- `Alert Threshold`
- `Enable Flight Alerts`

The `Normalize Form Config` node converts this input into the internal workflow format:

- Airport codes are trimmed and uppercased.
- Dates can be converted from `DD/MM/YYYY` to `YYYY-MM-DD`.
- Price, stops, and alert threshold values are converted to numbers.
- `excellent_price` is calculated as 85% of the maximum price.
- `max_duration_minutes` is currently fixed at 1500 minutes.
- Currency defaults to `USD`.

## Scoring Logic

Each flight starts with a score of 100 points. Penalties are then applied:

- Price above the configured maximum: `-40`
- Stops above the configured maximum: `-20`
- Duration above the configured maximum: `-30`

The final score is clamped between 0 and 100.

```text
alert = score >= alert_threshold
```

This keeps the core decision transparent, predictable, and easy to audit.

## Ollama Reasoning Layer

Ollama does not decide whether a flight is good or bad. n8n already calculates the score and alert flag before the LLM is called.

The Ollama node receives the flight details, score, alert status, and scoring reasons, then returns a JSON explanation with:

- `reason`
- `pros`
- `cons`

The `Parse Ollama JSON` node cleans and parses the model output before the Telegram message is built.

## Repository Structure

```text
.
├── docs/
│   ├── credentials.md
│   ├── local-llm-reasoning.md
│   └── workflow.md
├── examples/
│   └── ollama-flight-request.json
├── prompts/
│   └── flight-decision-prompt.md
├── scripts/
│   └── ollama-flight-judge.mjs
├── screenshots/
│   └── workflow-architecture.png
├── workflows/
│   ├── google-form-serpapi-ollama-google-flights.sanitized.json
│   ├── serpapi-ollama-google-flights.sanitized.json
│   └── smartfare-tracker-n8n.sanitized.json
├── docker-compose.yml
├── README.es.md
└── README.md
```

## Setup

1. Start n8n locally:

```bash
docker compose up -d
```

2. Import the main sanitized workflow into n8n:

```text
workflows/google-form-serpapi-ollama-google-flights.sanitized.json
```

3. Create or connect the Google Sheets workbook used by the workflow:

- `config`: stores the Google Forms responses / search configuration.
- `flight_history`: stores evaluated flight results.

4. Configure credentials inside n8n:

- Google Sheets OAuth2
- Telegram bot
- Ollama
- SerpAPI API key for the Google Flights HTTP request

5. Pull the local Ollama model:

```bash
ollama pull qwen2.5:7b
```

6. Review the Telegram node after import. The sanitized export uses a placeholder chat ID, so replace it with your chat ID or adapt it to use the normalized `telegram_chat_id` field.

## Local Ollama Test

You can test the reasoning prompt outside n8n:

```bash
node scripts/ollama-flight-judge.mjs
```

The sample payload lives in:

`examples/ollama-flight-request.json`

## Security Notes

- Do not commit real API keys, tokens, chat IDs, or Google credentials.
- Keep `.env`, `n8n_data/`, `.ollama/`, and credential files out of Git.
- Use sanitized workflow exports for public repositories.
- Configure real credentials inside n8n after importing the workflow.

## Current Status

This is a functional MVP. It can read configuration from Google Sheets, query real flight results with SerpAPI, score and log results, generate Ollama explanations, and send Telegram alerts.

## Current Limitations

- The `enabled` flag is normalized, but the workflow still needs an explicit filter before external API calls.
- Real multi-user Telegram routing is not fully implemented in the sanitized export.
- Friendly city names are not mapped to IATA airport codes yet.
- The workflow currently expects airport codes such as `EZE`, `YYZ`, or `YWG`.
- Deduplication works within one execution, not against the full historical log.
- `max_duration_minutes` is currently fixed in the workflow.
- Telegram alerts are limited to three items per execution.

## Roadmap

- Add validation before calling SerpAPI.
- Map friendly city names to airport codes with a `city_dictionary` sheet.
- Filter disabled configurations before API calls.
- Improve deduplication against historical results.
- Use dynamic Telegram Chat IDs per user.
- Separate production history, test history, and configuration errors.
- Allow free-text preferences interpreted by the local LLM.
- Improve the presentation layer for the final demo.
