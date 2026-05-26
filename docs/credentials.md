# Esquema de credenciales

Las credenciales se configuran dentro de n8n y no deben subirse al repositorio.

## Credenciales requeridas

| Credencial | Uso |
| --- | --- |
| Telegram bot token | Enviar alertas por Telegram |
| Google Sheets OAuth2 | Escribir resultados en Google Sheets |

## Reglas

- No guardar tokens en archivos versionados.
- No pegar secretos en `README`, `docs` ni exports del workflow.
- Usar credenciales de n8n para almacenar valores sensibles.

## Sugerencia de organización

- Mantener un único bot de Telegram para el MVP.
- Usar una cuenta de Google dedicada para las hojas del proyecto.
