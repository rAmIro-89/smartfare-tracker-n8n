# Repository Architecture

This repository is organized as a branch-based progression from the academic MVP to provider-specific experiments and a future local AI layer.

## Layered Evolution

```text
MVP Mock
  ↓
Aviationstack Experiment
  ↓
SerpAPI Real Fare Search
  ↓
Future Ollama Local AI Layer
```

## Meaning of Each Layer

- **MVP Mock**: stable academic delivery in `main`, with mock flight generation, Google Sheets logging, and Telegram alerts.
- **Aviationstack Experiment**: educational REST integration to validate HTTP Request handling, normalization, and controlled logging.
- **SerpAPI Real Fare Search**: real fare discovery for EZE → YWG with normalized price, duration, stops, and itinerary data.
- **Future Ollama Local AI Layer**: local AI enrichment, summarization, or classification without depending on external inference services.

## Branch Responsibility

- `main` stays stable and presentable.
- `feature/real-flight-api` is limited to Aviationstack.
- `feature/serpapi-google-flights` is limited to SerpAPI Google Flights.

## Practical Goal

Keep provider-specific logic isolated so each branch can be demonstrated independently before introducing Ollama.
