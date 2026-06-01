# SmartFare Tracker — SerpAPI Google Flights (rama: feature/serpapi-google-flights)

Esta rama documenta el camino de tarifas reales con SerpAPI Google Flights para rutas como EZE → YWG.

Notas:
- Esta rama es experimental y está enfocada exclusivamente en SerpAPI Google Flights.
- NO reemplazar `main` con este workflow; `main` sigue siendo el MVP estable académico que usa datos mock.

Qué incluye esta rama:
- `workflows/smartfare-tracker-serpapi-wip.sanitized.json` — export sanitizado de n8n (sin claves/secretos).
- `docs/serpapi-google-flights-plan.md` — plan y parámetros específicos de SerpAPI.
- `docs/repository-architecture.md` — arquitectura general de ramas y roadmap.
- `.env.example` actualizado con placeholders exclusivos de SerpAPI.

Uso:
- Configurar credenciales de SerpAPI en n8n o en `.env` local (no subir secretos).
- Importar el workflow sanitizado en n8n y configurar credenciales localmente.
# SmartFare Tracker n8n

Automatización en n8n para monitorear precios de vuelos, registrar resultados en Google Sheets y enviar alertas por Telegram cuando un vuelo cumple una regla de precio barato.

## Stack

- n8n
- Docker + WSL2
- Nodo Code con JavaScript
- Google Sheets
- Telegram Bot API
- Google OAuth2

## MVP actual

- Corre automáticamente cada 1 hora.
- Usa un mock provider para generar precios simulados de vuelos.
- Registra todos los resultados en Google Sheets.
- Envía alertas por Telegram solo para vuelos baratos.
- Usa una arquitectura desacoplada para futura integración con APIs reales.
- `main` estable se mantiene en modo mock para la entrega académica.

## Real API Integration - WIP

- El MVP estable se mantiene en modo mock para la entrega académica y el portfolio.
- La rama experimental reemplazará el Code Node mock por un HTTP Request Node.
- El objetivo es conectar una API real de vuelos sin cambiar el flujo hacia Google Sheets y Telegram.
- Secretos, API keys y credenciales de proveedores no deben subirse al repositorio.

## Campos registrados

| Campo | Descripción |
| --- | --- |
| Timestamp | Momento de ejecución |
| Origin | Aeropuerto de origen |
| Destination | Aeropuerto de destino |
| Airline | Aerolínea |
| Price | Precio del vuelo |
| Alert_type | Clasificación del registro |

## Credenciales necesarias

Configurar dentro de n8n:

- Token del bot de Telegram
- Credenciales OAuth2 de Google Sheets

No subir tokens ni secretos al repositorio.

## Arquitectura

```text
Schedule Trigger
      ↓
Nodo Code (JavaScript) - mock provider
      ↓
Proveedor simulado de vuelos
   ├── Registro histórico en Google Sheets
   └── IF precio < umbral
         └── Alerta por Telegram
```

## Vista del Workflow

![n8n workflow](screenshots/n8n-workflow.png)