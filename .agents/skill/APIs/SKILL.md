---
name: generar_servicio_api
description: '"Genera un servicio inyectable en Angular 21 utilizando el HttpClient moderno o Fetch API. Implementa tipado estricto con interfaces de TypeScript y maneja el estado de la petición (loading, error, data) utilizando Signals. Preparado para consumir endpoints RESTful."'
---
**Parámetros** 

`nombre_entidad` (String, Obligatorio - ej: "Usuario"), `metodos_http` (Array de Strings, Obligatorio - ej: `["GET", "POST"]`), `url_endpoint` (String, Obligatorio). _(Nota: Esta skill te va a venir bárbaro para conectar el front-end directamente con tus backends hechos en NestJS, Express o las bases de datos manejadas con Prisma)._