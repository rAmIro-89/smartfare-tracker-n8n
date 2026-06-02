# Local LLM Reasoning Layer

This branch adds a local Ollama-based reasoning layer for flight alerts. The goal is to keep the deterministic business scoring in n8n, then use a local model to produce a short explanation in JSON form.

## What is included

- `workflows/serpapi-ollama-google-flights.sanitized.json`: sanitized n8n export for the SerpAPI + Ollama flow.
- `prompts/flight-decision-prompt.md`: reusable prompt for flight reasoning.
- `examples/ollama-flight-request.json`: sample input payload for testing the prompt locally.
- `scripts/ollama-flight-judge.mjs`: Node.js helper that sends the prompt and sample input to Ollama.

## Environment variables

Configure these in your local `.env` file or inside n8n:

- `OLLAMA_HOST`: local Ollama base URL, for example `http://host.docker.internal:11434`.
- `OLLAMA_MODEL`: local model name, for example `qwen2.5:7b`.
- `OLLAMA_PROMPT_FILE`: path to the prompt file.
- `OLLAMA_INPUT_FILE`: optional path to the sample input JSON.
- `OLLAMA_TIMEOUT_MS`: optional timeout for local runs.
- `SERPAPI_API_KEY`: SerpAPI key for Google Flights search.
- `SERPAPI_DEPARTURE_ID`, `SERPAPI_ARRIVAL_ID`, `SERPAPI_OUTBOUND_DATE`: flight search parameters.
- `TELEGRAM_CHAT_ID`: destination chat for alert delivery.
- `GOOGLE_SHEETS_DOCUMENT_ID`: spreadsheet used for logging results.

## Local test flow

1. Start Ollama locally.
2. Pull or confirm the model, for example `qwen2.5:7b`.
3. Run the helper script:

```bash
node scripts/ollama-flight-judge.mjs
```

4. Inspect the JSON returned by the model.

## Expected JSON shape

The reasoning layer should return exactly this structure:

```json
{
  "score": 0,
  "alert": false,
  "reason": "",
  "pros": [],
  "cons": []
}
```

## Notes

- Keep the `.ollama/` directory local only; it is ignored by Git.
- Do not commit tokens, chat IDs, or Google credentials.
- The workflow keeps deterministic scoring in the Code node so alerts remain stable even if the LLM response varies slightly.
