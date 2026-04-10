---
name: css_puro
description: "Genera código CSS puro o declaraciones de variables CSS (Custom Properties). Se utiliza únicamente para animaciones complejas (@keyframes), selectores avanzados que Tailwind no cubre de forma limpia, o para definir variables de diseño personalizadas dentro de la directiva @theme de Tailwind 4. Retorna estrictamente código CSS."

---
**Parámetros (Esquema):**

- `selector_objetivo` _(String, Obligatorio)_: A qué clase, ID o pseudo-elemento se le va a aplicar el estilo (ej: `.mi-boton-glitch::before`).
    
- `efecto_deseado` _(String, Obligatorio)_: La explicación técnica de lo que el CSS debe lograr. Ej: _"Una animación infinita que cambie el background-position de un gradiente"_.
    
- `es_configuracion_tailwind` _(Boolean, Obligatorio)_: Este es el parámetro clave. Si es `true`, el agente sabe que tiene que devolver variables CSS para inyectar en tu archivo principal de Tailwind 4 (ej: `--color-mi-marca: #ff5500;`). Si es `false`, devuelve CSS normal.