# Real API Integration Plan

## Objective

Replace the current mock flight provider with a real flight API integration while keeping the downstream flow stable:

- generate or fetch flight data
- append rows in Google Sheets
- send cheap-flight alerts through Telegram

The MVP in `main` must remain stable and presentable. The experimental work should happen in `feature/real-flight-api`.

## Candidate Providers

Potential providers to evaluate:

- Amadeus for Flight Offers API
- Skyscanner or partner-backed aggregators, if available through a documented API
- Aviation or travel data providers with clear pricing and stable rate limits
- Any provider that supports authenticated HTTP requests and predictable response schemas

Selection criteria:

- official documentation
- free tier or controlled pricing
- clear rate limits
- response stability
- ease of integration with n8n HTTP Request nodes

## Fallback Strategy

The system should fail gracefully if the API is unavailable or too expensive:

1. Try the real API first.
2. If the request fails, fall back to the mock provider for demo continuity.
3. Keep Google Sheets logging active even when using fallback data.
4. Send Telegram alerts only when the price threshold is met.

This preserves the portfolio demo and avoids breaking the stable workflow.

## Cost and Rate Limit Risks

Important risks to track before production use:

- API usage can introduce recurring costs.
- Free tiers often have strict rate limits.
- Some providers require production verification before wider access.
- Frequent polling may increase cost without improving the MVP.
- Response latency can affect the schedule trigger window.

Mitigations:

- cache results when appropriate
- limit the execution frequency
- add a provider abstraction layer
- monitor API usage early

## Secret Management

Do not commit secrets, tokens, client IDs or provider IDs to the repository.

Use environment variables or n8n credentials for:

- `FLIGHT_API_PROVIDER`
- `FLIGHT_API_KEY`
- `FLIGHT_API_SECRET`
- `FLIGHT_API_BASE_URL`

If additional credentials are needed, store them only inside n8n or in local `.env` files excluded by `.gitignore`.

## n8n Migration Plan

The current mock provider lives in a Code Node with JavaScript. The target architecture should replace that logic with an HTTP Request Node.

Proposed steps:

1. Keep the Schedule Trigger.
2. Replace the mock Code Node with an HTTP Request Node for the real provider.
3. Parse the provider response in a small Code Node only if transformation is needed.
4. Keep the Google Sheets append step unchanged.
5. Keep the Telegram alert branch unchanged.
6. Add explicit error handling and fallback branching.

This approach reduces risk because only the provider layer changes.

## Validated Real API Integration

The experimental branch has already validated the Aviationstack flow end to end.

- API provider: Aviationstack
- endpoint: `/v1/flights`
- authentication: `access_key` query parameter
- result: 100 records returned
- transformation: normalized with a JavaScript Code Node
- persistence: 100 rows appended to Google Sheets
- alerting: IF price < 1000 + Limit 3 + Telegram
- pattern: log everything, alert selectively

Current validated shape:

Schedule Trigger → HTTP Request → Normalize Aviationstack Response → Google Sheets logging → IF price < 1000 → Limit 3 → Telegram alerts

## Deliverable Goal

By the end of the experimental branch, the project should have:

- a documented integration path
- placeholders ready in `.env.example`
- a clear separation between mock MVP and real API work
- no secrets committed to git
