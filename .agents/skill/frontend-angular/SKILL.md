---
name: generar_componente_angular
description: Genera el código completo de un componente Standalone para Angular 21. Retorna el TypeScript con la lógica y la inyección de servicios, implementa los ciclos de vida requeridos (OnInit, OnDestroy, etc.), y genera el archivo de pruebas unitarias (.spec.ts) para validar el renderizado del DOM y el comportamiento de la lógica de negocio.
---

Para que sea una herramienta moderna y no te genere código obsoleto (código _legacy_), le sumaría estos tres conceptos clave:

- **Signals por defecto:** En Angular 21, la reactividad pasa por los _Signals_. La _skill_ tiene que estar configurada para usar `signal()`, `computed()` y `effect()` en lugar de llenarte el componente de RxJS y _BehaviorSubjects_ para cosas simples.
    
- **Componentes Standalone:** Es vital asegurarnos de que la _skill_ no intente declarar el componente en un `app.module.ts`. Tiene que generar componentes con la flag `standalone: true` y sus propios `imports` en el decorador.
    
- **Tipado Estricto (TypeScript avanzado):** Para sacarle el máximo jugo a TypeScript, la _skill_ debería exigir que todos los _Inputs_, _Outputs_ (o _Model Signals_) y respuestas de los servicios estén fuertemente tipados con interfaces, evitando el uso de `any`.


Para que el agente sepa cómo ejecutar esta acción, le definiríamos estos parámetros (el JSON Schema):

- **`nombre_componente`** (String, Obligatorio): El nombre semántico (ej: `tabla-usuarios`).
    
- **`proposito_del_dom`** (String, Obligatorio): Qué tiene que mostrar exactamente el HTML (ej: "Una tabla con Tailwind 4 que itere sobre una lista de usuarios").
    
- **`servicios_requeridos`** (Array de Strings, Opcional): Qué servicios necesita inyectar (ej: `["UsuarioService", "NotificacionService"]`).
    
- **`ciclos_de_vida`** (Array de Strings, Opcional): Qué _hooks_ necesita implementar (ej: `["OnInit", "AfterViewInit"]`).
    
- **`generar_tests`** (Boolean, Obligatorio): Un flag que le indique si debe devolver también el código para el archivo `.spec.ts`. Esto es ideal para aplicar metodologías de testing automatizadas directamente con el agente.