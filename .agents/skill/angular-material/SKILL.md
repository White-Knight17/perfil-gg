---
name: implementar_componente_material
description: '"Genera un componente de Angular 21 utilizando exclusivamente módulos de Angular Material (Standalone). Configura las importaciones necesarias (ej: MatButtonModule, MatTableModule) y aplica la lógica de TypeScript requerida. No utiliza clases de Tailwind para los estilos internos del componente Material para evitar conflictos."'
---
**Parámetros (Esquema):**

- `tipo_componente` _(String, Obligatorio)_: Qué elemento de Material se necesita (ej: "MatDialog", "MatDatepicker").
    
- `requiere_datos_dinamicos` _(Boolean, Obligatorio)_: Si el componente necesita recibir datos externos (ej: para llenar una tabla).