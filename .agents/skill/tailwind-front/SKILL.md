---
name: maquetar_con_tailwind_4
description: "Recibe una estructura HTML o un template de Angular y requerimientos de diseño visual. Retorna el mismo código HTML aplicando exclusivamente clases utilitarias de Tailwind CSS v4 para lograr el diseño solicitado. Aplica diseño responsive (mobile-first), estados interactivos (hover, focus) y soporte para modo oscuro si se requiere. No genera etiquetas `<style>` ni archivos CSS externos."

---


**Parámetros (Esquema):**

- `template_base` _(String, Obligatorio)_: El código HTML crudo o el componente de Angular sin estilos al que hay que inyectarle las clases.
    
- `descripcion_visual` _(String, Obligatorio)_: Qué aspecto debe tener. Ej: _"Una tarjeta de perfil centrada, con imagen circular, sombra suave y bordes redondeados"_.
    
- `requiere_responsive` _(Boolean, Obligatorio)_: Un flag para que el agente sepa si tiene que aplicar prefijos como `md:`, `lg:`, etc.
    
- `soporta_dark_mode` _(Boolean, Opcional)_: Si debe incluir clases `dark:` para cuando cambie el tema.
    
- `paleta_colores` _(Array de Strings, Opcional)_: Si querés forzarlo a usar colores específicos (ej: `["slate-800", "emerald-500"]`).


