# Flujo del workflow

El workflow principal del proyecto es:

`workflows/google-form-serpapi-ollama-google-flights.sanitized.json`

Este export representa el MVP más completo: toma preferencias desde Google Forms / Google Sheets, consulta vuelos reales con SerpAPI Google Flights, normaliza resultados, aplica scoring, registra el histórico, genera una explicación con Ollama y envía alertas por Telegram.

## Diagrama textual

```text
Google Forms
-> Google Sheets, hoja config
-> Schedule Trigger, cada 6 horas
-> Get row(s) in sheet
-> Normalize Form Config
-> SerAPII Google Flights
-> Merge2
-> Normalize SerApi Response
-> Remove Duplicate Flights
-> Business Scoring Code Node
-> Append row in sheet
-> IF alert
-> Ollama - Message a model
-> Parse Ollama JSON
-> Merge
-> Limit, máximo 3 alertas
-> Telegram Alert
```

## Nodos principales

- `Schedule Trigger`: ejecuta el flujo cada 6 horas.
- `Get row(s) in sheet`: lee la hoja `config` con las preferencias capturadas por Google Forms.
- `Normalize Form Config`: normaliza fechas, códigos de aeropuerto, precio máximo, escalas, umbral de alerta y moneda.
- `SerAPII Google Flights`: consulta SerpAPI con el motor `google_flights`.
- `Normalize SerApi Response`: transforma `best_flights` y `other_flights` en registros individuales.
- `Remove Duplicate Flights`: elimina duplicados dentro de la misma ejecución usando aerolínea, número de vuelo, horarios y precio.
- `Business Scoring Code Node`: calcula el score con reglas determinísticas.
- `Append row in sheet`: registra cada vuelo evaluado en `flight_history`.
- `IF alert`: deja pasar solo vuelos cuyo score supera el umbral configurado.
- `Ollama - Message a model`: genera una explicación breve en JSON.
- `Parse Ollama JSON`: parsea la respuesta del modelo y usa fallback si el JSON no es válido.
- `Limit`: limita las alertas enviadas por Telegram a 3 items por ejecución.
- `Telegram Alert`: envía el resumen final del vuelo.

## Reglas de scoring

Cada vuelo comienza con 100 puntos:

- Si `price > max_price`, resta 40 puntos.
- Si `stops > max_stops`, resta 20 puntos.
- Si `duration_minutes > max_duration_minutes`, resta 30 puntos.

Luego el score se limita al rango 0-100.

```text
alert = score >= alert_threshold
```

## Punto de desacople

La lógica de negocio y la IA están separadas. El scoring determinístico decide si corresponde alertar. Ollama solo explica una decisión ya tomada por el workflow.

Esto permite auditar el sistema, depurar errores con más facilidad y cambiar el proveedor de vuelos o el modelo local sin reescribir toda la automatización.
