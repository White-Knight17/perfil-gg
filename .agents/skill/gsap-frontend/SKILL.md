---
name: crear_animacion_gsap
description: '"Genera la lógica matemática y de timelines usando la librería GSAP para animar elementos del DOM en un componente Angular. Retorna el código TypeScript necesario (usando ViewChild, ElementRef o Signals para capturar el elemento) y la configuración de la animación. No ejecuta comandos de instalación."'
license: White Knight
---
**Parámetros (Esquema):**

- `elemento_objetivo` _(String, Obligatorio)_: Qué es lo que se va a animar (ej: "Un div con la clase .tarjeta-hero").
    
- `tipo_animacion` _(String, Obligatorio)_: El estilo del movimiento (ej: "Fade-in desde abajo", "Stagger list", "Rotación 3D").
    
- `usa_scrolltrigger` _(Boolean, Obligatorio)_: Si la animación debe dispararse al hacer scroll (requiere el plugin ScrollTrigger de GSAP).
    
- `duracion_estimada` _(Number, Opcional)_: El tiempo en segundos que debería durar la animación base.


