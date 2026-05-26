# Flujo del workflow

Este proyecto usa n8n para ejecutar un MVP de monitoreo de vuelos con una arquitectura desacoplada. El flujo actual es:

```text
Schedule Trigger
      ↓
Nodo Code (JavaScript)
      ↓
Generador simulado de vuelos
   ├── Registro en Google Sheets
   └── IF precio < umbral
         └── Alerta por Telegram
```

## Objetivo

- Correr automáticamente cada 1 hora.
- Simular precios de vuelos mientras no se integren APIs reales.
- Guardar todos los resultados en Google Sheets.
- Avisar por Telegram solo cuando el precio sea considerado barato.

## Punto de desacople

La simulación de vuelos está separada del registro y de la notificación para poder reemplazarla luego por APIs reales sin reescribir el resto del workflow.
