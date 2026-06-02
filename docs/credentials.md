# Esquema de credenciales

Las credenciales se configuran dentro de n8n y no deben subirse al repositorio.

La configuración local de Ollama también se maneja por variables de entorno; no guardes modelos ni secretos en Git.

## Credenciales requeridas

| Credencial | Uso |
| --- | --- |
| Telegram bot token | Enviar alertas por Telegram |
| Google Sheets OAuth2 | Escribir resultados en Google Sheets |
| SerpAPI API key | Buscar vuelos reales en Google Flights |
| Ollama host/model | Ejecutar el razonamiento local |

## Reglas

- No guardar tokens en archivos versionados.
- No pegar secretos en `README`, `docs` ni exports del workflow.
- Usar credenciales de n8n para almacenar valores sensibles.
- Mantener `.ollama/` fuera del repositorio.

## Sugerencia de organización

- Mantener un único bot de Telegram para el MVP.
- Usar una cuenta de Google dedicada para las hojas del proyecto.
