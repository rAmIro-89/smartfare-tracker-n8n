# Flujo del workflow

Este proyecto usa n8n para ejecutar un MVP de monitoreo de vuelos con una arquitectura desacoplada. El flujo actual es:

```text
Schedule Trigger
      ↓
Nodo Code (JavaScript)
      ↓
Generador simulado de vuelos
   ├── Registro en Google Sheets
   └── IF score >= umbral
         ├── Alerta por Telegram
         └── Revisión de razonamiento con Ollama (rama local)
```

## Objetivo

- Correr automáticamente cada 1 hora.
- Consultar SerpAPI Google Flights para traer resultados reales.
- Guardar todos los resultados en Google Sheets.
- Avisar por Telegram solo cuando el score supere el umbral.
- Usar Ollama local para generar reason/pros/cons en JSON.

## Punto de desacople

La consulta de vuelos, el scoring determinista y el razonamiento local están separados para poder cambiar el proveedor o el modelo sin reescribir el resto del workflow.
