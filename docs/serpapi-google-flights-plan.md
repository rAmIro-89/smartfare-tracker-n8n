# SerpAPI (Google Flights) Integration Plan

## Objetivo

Integrar SerpAPI (Google Flights) como proveedor real de tarifas para EZE → YWG, con salida orientada a precios, tiempos, escalas e itinerarios.

## Parámetros usados

- `engine=google_flights`
- `api_key` via `SERPAPI_API_KEY` (never commit)
- `departure_id=EZE`
- `arrival_id=YWG`
- `outbound_date` via `SERPAPI_OUTBOUND_DATE`
- `type=2` for one-way
- `currency=USD`
- `hl=en`
- `gl=us`

## Estructura de respuesta (resumen)

SerpAPI typically returns a JSON response with flight options and itinerary data. The normalized workflow should extract:

- `price`
- `total_duration`
- `stops`
- `origin`
- `destination`
- `airline`
- `flight_number`
- `departure_time`
- `arrival_time`
- `provider`

## Campos normalizados (n8n Code Node)

- `timestamp` — ISO execution time
- `origin` — `EZE`
- `destination` — `YWG`
- `airline` — carrier name
- `flight_number` — flight identifier
- `price` — numeric amount in USD
- `total_duration` — total trip duration
- `stops` — number of stops
- `departure_time` — normalized departure time
- `arrival_time` — normalized arrival time
- `provider` — `SerpAPI Google Flights`
- `alert_type` — e.g. `SerpAPI flight result`

## Filtros de negocio

- `price <= DEFAULT_MAX_PRICE`
- `stops <= DEFAULT_MAX_STOPS`
- `total_duration <= DEFAULT_MAX_DURATION_MINUTES`
- Log everything, alert selectively.

## Cost / Free tier limitations

- SerpAPI can impose request limits and usage-based costs.
- Mitigations: lower frequency, cache results, and keep the workflow focused on demo-sized queries.

## Secret management

- Do NOT commit `SERPAPI_API_KEY` or any other token.
- Keep secrets only in n8n credentials or local `.env` files excluded by `.gitignore`.

## Import notes

- Use the sanitized workflow `workflows/smartfare-tracker-serpapi-wip.sanitized.json` and configure credentials locally in n8n before enabling.
