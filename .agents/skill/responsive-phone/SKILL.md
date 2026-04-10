---
name: adaptar_layout_plegables
description: '"Modifica el HTML y CSS de un componente utilizando Viewport Segments API y Device Posture API para adaptar la interfaz a dispositivos plegables (Dual Screen o Foldables). Calcula la posición de la bisagra y asegura que el contenido vital no quede oculto utilizando variables de entorno (env)."'
---
**Parámetros (Esquema):**

- `codigo_base` _(String, Obligatorio)_: El componente HTML a adaptar.
    
- `tipo_dispositivo_objetivo` _(String, Obligatorio)_: "vertical" (tipo Fold/Libro) u "horizontal" (tipo Flip/Laptop miniatura).