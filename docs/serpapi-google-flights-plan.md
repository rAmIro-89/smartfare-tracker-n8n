# SerpAPI (Google Flights) Integration Plan

## Objetivo

Integrar SerpAPI (Google Flights) como proveedor de tarifas para el caso EZE → YWG, obteniendo precios, duración y número de escalas.

## Parámetros usados

- `engine=google_flights`
- `api_key`: provided via `SERPAPI_API_KEY` (do not commit)
- `q` / origin/destination/date parameters as required (see examples in n8n HTTP Request node)
- currency, max_price, max_stops, max_duration_minutes (see `.env.example`)

## Estructura de respuesta (resumen)

SerpAPI returns a JSON with results list; each item typically contains:
- price (amount, currency)
- airline
- duration (minutes or formatted)
- number of stops
- itinerary / legs with origin/destination and times

## Campos normalizados (n8n Code Node)

- `timestamp` — execution time ISO
- `origin` — IATA code (EZE)
- `destination` — IATA code (YWG)
- `airline` — carrier name
- `price` — numeric amount (USD)
- `stops` — integer
- `duration_minutes` — integer
- `itinerary` — summary string
- `alert_type` — e.g., "SerpAPI flight result"

## Filtros de negocio

- `price <= DEFAULT_MAX_PRICE` (alerts)
- `stops <= DEFAULT_MAX_STOPS`
- `duration_minutes <= DEFAULT_MAX_DURATION_MINUTES`
- The workflow pattern is: log everything; alert selectively (IF + Limit)

## Cost / Free tier limitations

- SerpAPI has rate limits and possible costs per request for Google Flights engine.
- Mitigations: reduce frequency, cache results, limit fields, sample responses.

## Secret management

- Do NOT commit `SERPAPI_API_KEY` or any tokens.
- Store in n8n credentials or in a local `.env` excluded by `.gitignore`.

## Import notes

- Use the sanitized workflow `workflows/smartfare-tracker-serpapi-wip.sanitized.json` and configure credentials locally in n8n before enabling.
